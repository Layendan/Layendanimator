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

<main class="m-4 mb-20">
  <slot />
</main>

<div
  class="btm-nav btm-nav-sm bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 z-50"
>
  <button
    on:click={() => goto('/')}
    class:border-t-2={$page.route.id === '/' ||
      $page.route.id === '/[id]' ||
      $page.route.id === '/[id]/[episode]'}
  >
    <Home height={20} width={20} />
  </button>
  <button
    on:click={() => goto('/search')}
    class:border-t-2={$page.route.id === '/search'}
  >
    <Search height={20} width={20} />
  </button>
  <button
    on:click={() => goto('/library')}
    class:border-t-2={$page.route.id === '/library'}
  >
    <Bookmark height={20} width={20} />
  </button>
  <button
    on:click={() => goto('/settings')}
    class:border-t-2={$page.route.id === '/settings'}
  >
    <Settings height={20} width={20} />
  </button>
</div>
