<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentContextMenu } from '$lib/model/contextmenu';
  import { notifications } from '$lib/model/notifications';
  import {
    checkUpdate,
    defaultProviders,
    providers,
    source,
    type Provider
  } from '$lib/model/source';
  import { encodeName } from '$lib/model/theme';
  import {
    faArrowRight,
    faCloudArrowDown,
    faPen,
    faShare,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import ContextMenu from './ContextMenu.svelte';

  export let provider: Provider;
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

  async function exportSource() {
    try {
      const [{ save }, { downloadDir, join }, { writeTextFile }] =
        await Promise.all([
          import('@tauri-apps/api/dialog'),
          import('@tauri-apps/api/path'),
          import('@tauri-apps/api/fs')
        ]);

      const filePath = await save({
        title: 'Export Source',
        filters: [{ name: 'JSON', extensions: ['json'] }],
        defaultPath: await join(await downloadDir(), provider.name)
      });

      if (!filePath) return;

      await writeTextFile(filePath, JSON.stringify(provider, null, 2));

      notifications.addNotification({
        title: 'Export Successful',
        message: `Source exported to ${filePath}`,
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
      {provider.name}
    </h2>

    {#if $source.id != provider.id}
      <li>
        <button
          on:click={() => {
            $source = provider;
            goto(`/${provider.id}/`);
          }}
        >
          <Fa icon={faArrowRight} class="text-accent" />
          Set as Source
        </button>
      </li>
    {/if}

    <li>
      <button
        on:click={async () => {
          if (window.location.pathname != '/settings') await goto('/settings');

          const element = document.getElementById(
            `${encodeName(provider.id)}-info`
          );
          if (!element) return;

          element.click();
          element.scrollTo({ behavior: 'smooth' });
        }}
      >
        <Fa icon={faPen} />
        Edit
      </button>
    </li>

    {#if provider.updateUrl}
      <li>
        <button on:click={() => checkUpdate(provider)}>
          <Fa icon={faCloudArrowDown} />
          Check for Updates
        </button>
      </li>
    {/if}

    <li>
      <button on:click={exportSource}>
        <Fa icon={faShare} />
        Export
      </button>
    </li>

    {#if !defaultProviders[provider.id]}
      <li>
        <button
          on:click={async () => {
            const { confirm } = await import('@tauri-apps/api/dialog');
            const confirmed = await confirm(
              'This action cannot be reverted. Are you sure?',
              {
                title: 'Delete Source',
                type: 'warning',
                okLabel: "Yes, I'm Sure"
              }
            );
            if (confirmed) {
              providers.remove(provider);
              notifications.addNotification({
                title: 'Success',
                message: 'Source deleted successfully',
                type: 'success'
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
