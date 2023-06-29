<script lang="ts">
  import { settings } from '$lib/model/settings';
  import { toStyleString, type Theme } from '$lib/model/theme';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import type { Theme as TauriTheme } from '@tauri-apps/api/window';
  import { onDestroy, onMount } from 'svelte';

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
</script>

{#if theme.name === 'system'}
  <button
    class="grid w-max overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme.name === theme.name
      ? 'border-accent/80 hover:border-accent/100 focus-visible:border-accent/100'
      : 'border-base-content/20 hover:border-base-content/40 focus-visible:border-base-content/40'}"
    on:click={() => ($settings.theme = theme)}
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
      class="badge badge-error indicator-item font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      on:click={() => {
        settings.update(s => {
          delete s.themes[theme.name];
          if (s.theme.name === theme.name) {
            s.theme = s.themes.system;
            document
              .querySelectorAll(`head > style#${theme.name}`)
              ?.forEach(style => style.remove());
          }
          return s;
        });
      }}
    >
      X
    </button>
    <button
      class="overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme.name === theme.name
        ? 'border-accent/80 hover:border-accent/100 focus-visible:border-accent/100'
        : 'border-base-content/20 hover:border-base-content/40 focus-visible:border-base-content/40'}"
      on:click={() => ($settings.theme = theme)}
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
  </div>
{:else if theme.name === 'light' || theme.name === 'dark'}
  <button
    class="overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme.name === theme.name
      ? 'border-accent/80 hover:border-accent/100 focus-visible:border-accent/100'
      : 'border-base-content/20 hover:border-base-content/40 focus-visible:border-base-content/40'}"
    on:click={() => ($settings.theme = theme)}
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
