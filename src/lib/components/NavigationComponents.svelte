<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { clearCache } from '$lib/model/cache';
  import { getOS } from '$lib/model/info';
  import {
    faArrowLeft,
    faArrowRight,
    faRotateRight
  } from '@fortawesome/free-solid-svg-icons';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import type { OsType } from '@tauri-apps/api/os';
  import { onDestroy, onMount } from 'svelte';
  import Fa from 'svelte-fa';

  let isFullscreen = false;
  let osType: OsType | 'Unknown' = 'Unknown';
  let unsubscribe: UnlistenFn;

  onMount(async () => {
    const [{ getCurrent }, { listen }, os] = await Promise.all([
      import('@tauri-apps/api/window'),
      import('@tauri-apps/api/event'),
      getOS()
    ]);
    isFullscreen = await getCurrent().isFullscreen();
    osType = os;

    if (os !== 'Darwin') return;
    unsubscribe = await listen('tauri://resize', async () => {
      isFullscreen = await getCurrent().isFullscreen();
    });
  });

  onDestroy(() => {
    unsubscribe?.();
  });
</script>

<div
  class="flex gap-1"
  class:justify-end={osType === 'Darwin' && !isFullscreen}
>
  <button
    class="btn btn-square btn-ghost btn-sm pointer-events-auto"
    on:click={() => window.history.back()}
    aria-label="Navigate Backward"
  >
    <Fa icon={faArrowLeft} size="1.2x" />
  </button>
  <button
    class="btn btn-square btn-ghost btn-sm pointer-events-auto"
    on:click={() => window.history.forward()}
    aria-label="Navigate Forward"
  >
    <Fa icon={faArrowRight} size="1.2x" />
  </button>
  <button
    class="btn btn-square btn-ghost btn-sm pointer-events-auto"
    on:click={() => {
      clearCache();
      invalidateAll();
    }}
    aria-label="Reload page"
  >
    <Fa icon={faRotateRight} size="1.2x" />
  </button>
</div>
