<script lang="ts">
  import { settings } from '$lib/model/settings';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import type { Theme } from '@tauri-apps/api/window';
  import { onDestroy, onMount } from 'svelte';

  export let theme: string;

  let systemTheme: Theme | null = null;
  let unsubscribe: UnlistenFn;

  async function getTheme() {
    try {
      const { appWindow } = await import('@tauri-apps/api/window');
      return appWindow?.theme();
    } catch {
      return 'light';
    }
  }

  if (theme === 'system') {
    onMount(async () => {
      systemTheme = await getTheme();

      const { listen } = await import('@tauri-apps/api/event');
      unsubscribe = await listen?.<Theme>(
        'tauri://theme-changed',
        ({ payload }) => {
          systemTheme = payload;
        }
      );
    });
  }

  onDestroy(() => {
    unsubscribe?.();
  });
</script>

{#if theme != 'system'}
  <button
    class="overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme === theme
      ? 'border-accent/80 hover:border-accent/100'
      : 'border-base-content/20 hover:border-base-content/40'}"
    on:click={() => ($settings.theme = theme)}
  >
    <div
      data-theme={theme}
      class="w-full cursor-pointer bg-base-100 font-sans text-base-content"
    >
      <div class="grid grid-cols-5 grid-rows-3">
        <div class="col-start-1 row-span-2 row-start-1 bg-base-200" />
        <div class="col-start-1 row-start-3 bg-base-300" />
        <div
          class="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2"
        >
          <div class="font-bold capitalize">{theme}</div>
          <div class="flex flex-wrap gap-1">
            <div
              class="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6"
            >
              <div class="text-sm font-bold text-primary-content">A</div>
            </div>
            <div
              class="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6"
            >
              <div class="text-sm font-bold text-secondary-content">A</div>
            </div>
            <div
              class="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6"
            >
              <div class="text-sm font-bold text-accent-content">A</div>
            </div>
            <div
              class="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6"
            >
              <div class="text-sm font-bold text-neutral-content">A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
{:else}
  <button
    class="grid overflow-hidden rounded-lg border-2 outline outline-2 outline-offset-2 outline-transparent
    {$settings.theme === theme
      ? 'border-accent/80 hover:border-accent/100'
      : 'border-base-content/20 hover:border-base-content/40'}"
    on:click={() => ($settings.theme = theme)}
  >
    {#await systemTheme then systemTheme}
      <div
        data-theme={systemTheme || 'light'}
        class="w-full cursor-pointer bg-base-100 font-sans text-base-content"
      >
        <div class="grid grid-cols-5 grid-rows-3">
          <div class="col-start-1 row-span-2 row-start-1 bg-base-200" />
          <div class="col-start-1 row-start-3 bg-base-300" />
          <div
            class="col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 bg-base-100 p-2"
          >
            <div class="font-bold capitalize">{theme}</div>
            <div class="flex flex-wrap gap-1">
              <div
                class="flex aspect-square w-5 items-center justify-center rounded bg-primary lg:w-6"
              >
                <div class="text-sm font-bold text-primary-content">A</div>
              </div>
              <div
                class="flex aspect-square w-5 items-center justify-center rounded bg-secondary lg:w-6"
              >
                <div class="text-sm font-bold text-secondary-content">A</div>
              </div>
              <div
                class="flex aspect-square w-5 items-center justify-center rounded bg-accent lg:w-6"
              >
                <div class="text-sm font-bold text-accent-content">A</div>
              </div>
              <div
                class="flex aspect-square w-5 items-center justify-center rounded bg-neutral lg:w-6"
              >
                <div class="text-sm font-bold text-neutral-content">A</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/await}
  </button>
{/if}
