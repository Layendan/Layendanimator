<script lang="ts">
  import { page } from '$app/stores';
  import { createSourceContextMenu } from '$lib/model/contextmenu';
  import { providers, source, type Provider } from '$lib/model/source';
  import { tasks } from '$lib/model/updates';
  import { faBookmark, faCog } from '@fortawesome/free-solid-svg-icons';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import type { Theme } from '@tauri-apps/api/window';
  import { onDestroy, onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { cubicOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import { showMenu } from 'tauri-plugin-context-menu';
  import NavigationComponents from './NavigationComponents.svelte';
  import SearchBar from './SearchBar.svelte';

  let systemTheme: Theme | null = null;
  let unsubscribe: UnlistenFn;
  const taskValue = tweened(0, {
    duration: 1000,
    easing: cubicOut
  });
  const taskMax = tweened(0, {
    duration: 1000,
    easing: cubicOut
  });
  $: if ($tasks[0]) {
    const { value = 0, max = 0 } = $tasks[0];
    taskValue.set(value);
    taskMax.set(max);
  }

  async function getTheme() {
    try {
      const { appWindow } = await import('@tauri-apps/api/window');
      return appWindow?.theme();
    } catch {
      return 'light';
    }
  }

  if (window?.__TAURI__) {
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

  function contextMenu(provider: Provider) {
    if (window.__TAURI__) {
      showMenu({
        items: createSourceContextMenu(provider)
      });
    }
  }
</script>

<nav
  class="pointer-events-none flex h-full w-[214px] flex-col gap-2 overflow-visible !bg-transparent px-1"
  data-theme={systemTheme}
>
  {#if window?.__TAURI__}
    <NavigationComponents />
  {/if}

  <a
    href="/{$source.id}"
    class="btn btn-ghost pointer-events-auto bg-base-content/10 text-xl normal-case"
    aria-label="Home"
  >
    Layendanimator
  </a>

  <SearchBar />

  <div
    class="divider my-0 before:bg-base-content before:bg-opacity-20 after:bg-base-content after:bg-opacity-20"
  />

  <!-- TODO: Overflow-visible will make tabbing focus visible, but not with overflow-y-auto for some reason -->
  <div
    class="pointer-events-auto mb-auto flex h-fit flex-col gap-2 overflow-y-auto overflow-x-visible overscroll-contain"
  >
    <a
      href="/library"
      class="btn btn-ghost btn-sm normal-case"
      class:transparent-base={$page.route.id?.startsWith('/library') &&
        !$page.params.source}
      aria-label="Library"
    >
      <Fa icon={faBookmark} size="1.2x" />
      Library
    </a>

    <a
      href="/settings"
      class="btn btn-ghost btn-sm normal-case"
      class:transparent-base={$page.route.id?.startsWith('/settings')}
      aria-label="Settings"
    >
      <Fa icon={faCog} size="1.2x" />
      Settings
    </a>

    <div
      class="divider my-0 before:bg-base-content before:bg-opacity-20 after:bg-base-content after:bg-opacity-20"
    />

    {#each Object.entries($providers) as [id, provider] (id)}
      <a
        href="/{id}"
        class="btn btn-ghost btn-sm w-full flex-nowrap normal-case"
        class:transparent-base={id === $page.params.source}
        aria-label="Change Source"
        on:click={() => source.set(provider)}
        on:contextmenu={() => contextMenu(provider)}
      >
        <img
          src={provider.logo}
          alt={provider.name}
          class="h-5 w-5 rounded-md"
        />
        <p class="overflow-hidden text-ellipsis whitespace-nowrap leading-4">
          {provider.name}
        </p>
      </a>
    {/each}
  </div>

  {#if $tasks.length > 0}
    <div class="h-fit w-full rounded-lg bg-base-content/10 p-4" transition:fade>
      <span class="mb-2 inline-flex h-fit w-full items-center justify-between">
        <h3 class="text-lg font-semibold">{$tasks[0].title}</h3>
        <p class="text-sm">{$tasks[0].value}/{$tasks[0].max}</p>
      </span>
      <progress class="progress w-full" value={$taskValue} max={$taskMax} />
    </div>
  {/if}
</nav>

<style>
  .transparent-base:not(:hover) {
    @apply bg-base-content/10;
  }
</style>
