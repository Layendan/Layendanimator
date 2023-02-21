<script lang="ts">
  import Home from '$lib/components/svg/Home.svelte';
  import Search from '$lib/components/svg/Search.svelte';
  import Settings from '$lib/components/svg/Settings.svelte';
  import Bookmark from '$lib/components/svg/Bookmark.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { page, navigating } from '$app/stores';
  import { onMount } from 'svelte';
  import { source } from '$lib/model/source';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { searchHistory } from '$lib/model/searchHistory';
  import '../app.css';

  import NProgress from 'nprogress';
  import '../nprogress.css';

  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false
  });

  $: {
    if ($navigating) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }

  // let scrollY = 0;

  onMount(async () => {
    if (!online) {
      goto('/library', { replaceState: true });
    }

    await Promise.allSettled([
      source.initialize(),
      subscriptions.initialize(),
      unwatchedSubscriptions.initialize(),
      searchHistory.initialize()
    ]);
  });

  let online: boolean;
</script>

<svelte:window bind:online />

<svelte:body
  on:keydown={e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      invalidateAll();
    }
  }}
/>

<!-- <svelte:window bind:scrollY /> -->

<!-- Back Button -->
<!-- {#if $page.route.id !== '/' && $page.route.id !== '/search' && $page.route.id !== '/settings'}
  <button
    class="fixed inset-0 z-50 btn btn-square btn-sm btn-primary border-none ml-4 mt-4 backdrop-filter backdrop-blur-md bg-opacity-50 shadow-xl"
    on:click={() => history.back()}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-chevron-left"
      ><polyline points="15 18 9 12 15 6" /></svg
    >
  </button>
{/if} -->
<!-- <header
  data-tauri-drag-region
  class="h-8 absolute z-50 left-0 right-0 top-0 bg-base-100 w-screen inline-flex content-between items-center"
>
  <img src="/loading_failure.jpeg" alt="logo" class="aspect-square w-4" />
  <div class="inline-flex gap-1">
    <button class="minimize" on:click={() => console.log('Minimize requested')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-minus"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
    <button class="exit" on:click={() => console.log('Exit requested')}>
      <X width={24} height={24} />
    </button>
  </div>
</header> -->

<main class="m-4 mb-20">
  <slot />
</main>

<div
  class="btm-nav btm-nav-sm bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 z-50"
>
  <button on:click={() => goto('/')}>
    <Home
      height={20}
      width={20}
      active={$page.route.id === '/' ||
        $page.route.id === '/[id]' ||
        $page.route.id === '/[id]/[episode]'}
    />
  </button>
  <button on:click={() => goto('/search')}>
    <Search height={20} width={20} active={$page.route.id === '/search'} />
  </button>
  <button on:click={() => goto('/library')}>
    <Bookmark height={20} width={20} active={$page.route.id === '/library'} />
  </button>
  <button on:click={() => goto('/settings')}>
    <Settings height={20} width={20} active={$page.route.id === '/settings'} />
  </button>
</div>
