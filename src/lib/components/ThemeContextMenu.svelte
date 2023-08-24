<script lang="ts">
  import { currentContextMenu } from '$lib/model/contextmenu';
  import { notifications } from '$lib/model/notifications';
  import { settings } from '$lib/model/settings';
  import { encodeName, type Theme } from '$lib/model/theme';
  import {
    faArrowRight,
    faShare,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import ContextMenu from './ContextMenu.svelte';

  export let theme: Theme;
  export let element: HTMLElement;

  let pos = { x: 0, y: 0 };
  let showMenu = false;
  const id = crypto.randomUUID();

  async function onRightClick(e: MouseEvent) {
    e.preventDefault();

    if (showMenu) {
      showMenu = false;
      await new Promise(res => setTimeout(res, 200));
    }

    pos = { x: e.clientX, y: e.clientY };
    showMenu = true;
  }

  $: if (id !== $currentContextMenu) showMenu = false;

  async function closeMenu() {
    showMenu = false;
    currentContextMenu.set(undefined);
  }

  $: element && element.addEventListener('contextmenu', onRightClick);

  async function exportTheme() {
    try {
      const [{ save }, { downloadDir, join }, { writeTextFile }] =
        await Promise.all([
          import('@tauri-apps/api/dialog'),
          import('@tauri-apps/api/path'),
          import('@tauri-apps/api/fs')
        ]);

      const filePath = await save({
        title: 'Export Theme',
        filters: [{ name: 'JSON', extensions: ['json'] }],
        defaultPath: await join(await downloadDir(), theme.name)
      });

      if (!filePath) return;

      await writeTextFile(filePath, JSON.stringify(theme, null, 2));

      notifications.addNotification({
        title: 'Export Successful',
        message: `Theme exported to ${filePath}`,
        type: 'success'
      });
    } catch (e) {
      console.error(e);
      notifications.addNotification({
        title: 'Export Failed',
        message: e as string,
        type: 'error'
      });
    }
  }
</script>

{#if showMenu}
  <ContextMenu {...pos} {id} on:click={closeMenu} on:clickoutside={closeMenu}>
    <h2
      class="menu-title w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize"
    >
      {theme.name}
    </h2>

    {#if $settings.theme.id !== theme.id}
      <li>
        <button on:click={() => element?.click()}>
          <Fa icon={faArrowRight} class="text-accent" />
          Set Theme
        </button>
      </li>
    {/if}

    <li>
      <button on:click={exportTheme}>
        <Fa icon={faShare} />
        Export
      </button>
    </li>

    {#if theme.name !== 'system' && theme.name !== 'light' && theme.name !== 'dark'}
      <li>
        <button
          on:click={async () => {
            const { confirm } = await import('@tauri-apps/api/dialog');
            const confirmed = await confirm(
              'This action cannot be reverted. Are you sure?',
              {
                title: 'Delete Theme',
                type: 'warning',
                okLabel: "Yes, I'm Sure"
              }
            );
            if (confirmed) {
              settings.update(s => {
                delete s.themes[theme.name];
                if (s.theme.name === theme.name) {
                  s.theme = s.themes.system;
                  document
                    .querySelectorAll(`head > style#${encodeName(theme.name)}`)
                    ?.forEach(style => style.remove());
                }
                return s;
              });
            }
          }}
        >
          <Fa icon={faTrash} class="text-error" />
          Delete
        </button>
      </li>
    {/if}
  </ContextMenu>
{/if}
