<script lang="ts">
  import { createThemeContextMenu } from '$lib/model/contextmenu';
  import { settings } from '$lib/model/settings';
  import { encodeName, toStyleString, type Theme } from '$lib/model/theme';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import type { Theme as TauriTheme } from '@tauri-apps/api/window';
  import { onDestroy, onMount } from 'svelte';
  import { showMenu } from 'tauri-plugin-context-menu';
  import ThemeContextMenu from './ThemeContextMenu.svelte';

  export let theme: Theme;

  let systemTheme: TauriTheme | null = null;
  let unsubscribe: UnlistenFn;

  async function getTheme() {
    try {
      const { appWindow } = await import('@tauri-apps/api/window');
      return appWindow?.theme();
    } catch {
      return 'light';
    }
  }

  onMount(async () => {
    if (theme.name === 'system') {
      systemTheme = await getTheme();

      const { listen } = await import('@tauri-apps/api/event');
      unsubscribe = await listen?.<TauriTheme>(
        'tauri://theme-changed',
        ({ payload }) => {
          systemTheme = payload;
        }
      );
    }
  });

  onDestroy(() => {
    unsubscribe?.();
  });

  let element: HTMLElement;

  function contextMenu(defaultTheme: boolean) {
    if (window.__TAURI__) {
      showMenu({
        items: createThemeContextMenu(theme, element, defaultTheme)
      });
    }
  }
</script>

{#if theme.name === 'system'}
  <button
    class="grid w-max select-none overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme.id === theme.id
      ? 'border-accent/80 hover:border-accent/100 focus-visible:border-accent/100'
      : 'border-base-content/20 hover:border-base-content/40 focus-visible:border-base-content/40'}"
    on:click={() => ($settings.theme = theme)}
    on:contextmenu|stopPropagation|preventDefault={() => contextMenu(true)}
    bind:this={element}
  >
    <div
      data-theme={systemTheme}
      class="w-full cursor-pointer bg-base-100 text-base-content"
    >
      <div class="grid grid-cols-5 grid-rows-3">
        <div class="col-start-1 row-span-2 row-start-1 bg-base-200" />
        <div class="col-start-1 row-start-3 bg-base-300" />
        <div
          class="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2"
        >
          <div class="font-bold capitalize">{theme.name}</div>
          <div class="flex justify-around gap-1">
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-primary"
            >
              <div class="text-sm font-bold text-primary-content">A</div>
            </div>
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-secondary"
            >
              <div class="text-sm font-bold text-secondary-content">A</div>
            </div>
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-accent"
            >
              <div class="text-sm font-bold text-accent-content">A</div>
            </div>
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-neutral"
            >
              <div class="text-sm font-bold text-neutral-content">A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
{:else if theme.css && theme.colorScheme}
  <div class="group indicator">
    <button
      class="select-none overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme.id === theme.id
        ? 'border-accent/80 hover:border-accent/100 focus-visible:border-accent/100'
        : 'border-base-content/20 hover:border-base-content/40 focus-visible:border-base-content/40'}"
      on:click={() => ($settings.theme = theme)}
      on:contextmenu|stopPropagation|preventDefault={() => contextMenu(false)}
      bind:this={element}
    >
      <div
        style={toStyleString(theme.css, theme.colorScheme)}
        class="w-full cursor-pointer bg-base-100 text-base-content"
      >
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-start-1 row-span-2 row-start-1 bg-base-200" />
          <div class="col-start-1 row-start-3 bg-base-300" />
          <div
            class="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2"
          >
            <div class="font-bold capitalize">{theme.name}</div>
            <div class="flex justify-around gap-1">
              <div
                class="flex aspect-square w-6 items-center justify-center rounded bg-primary"
              >
                <div class="text-sm font-bold text-primary-content">A</div>
              </div>
              <div
                class="flex aspect-square w-6 items-center justify-center rounded bg-secondary"
              >
                <div class="text-sm font-bold text-secondary-content">A</div>
              </div>
              <div
                class="flex aspect-square w-6 items-center justify-center rounded bg-accent"
              >
                <div class="text-sm font-bold text-accent-content">A</div>
              </div>
              <div
                class="flex aspect-square w-6 items-center justify-center rounded bg-neutral"
              >
                <div class="text-sm font-bold text-neutral-content">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
    <button
      class="badge indicator-item badge-error font-semibold opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
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
      X
    </button>
  </div>
{:else if theme.name === 'light' || theme.name === 'dark'}
  <button
    class="select-none overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme.id === theme.id
      ? 'border-accent/80 hover:border-accent/100 focus-visible:border-accent/100'
      : 'border-base-content/20 hover:border-base-content/40 focus-visible:border-base-content/40'}"
    on:click={() => ($settings.theme = theme)}
    on:contextmenu|stopPropagation|preventDefault={() => contextMenu(true)}
    bind:this={element}
  >
    <div
      data-theme={theme.name}
      class="w-full cursor-pointer bg-base-100 text-base-content"
    >
      <div class="grid grid-cols-5 grid-rows-3">
        <div class="col-start-1 row-span-2 row-start-1 bg-base-200" />
        <div class="col-start-1 row-start-3 bg-base-300" />
        <div
          class="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2"
        >
          <div class="font-bold capitalize">{theme.name}</div>
          <div class="flex justify-around gap-1">
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-primary"
            >
              <div class="text-sm font-bold text-primary-content">A</div>
            </div>
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-secondary"
            >
              <div class="text-sm font-bold text-secondary-content">A</div>
            </div>
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-accent"
            >
              <div class="text-sm font-bold text-accent-content">A</div>
            </div>
            <div
              class="flex aspect-square w-6 items-center justify-center rounded bg-neutral"
            >
              <div class="text-sm font-bold text-neutral-content">A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
{/if}

{#if !window.__TAURI__}
  <ThemeContextMenu {theme} {element} />
{/if}
