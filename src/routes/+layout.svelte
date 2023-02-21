<script lang="ts">
  import '../app.css';
  import '../nprogress.css';

  import { invalidateAll } from '$app/navigation';
  import { navigating } from '$app/stores';
  import { onMount } from 'svelte';
  import { source } from '$lib/model/source';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { searchHistory } from '$lib/model/searchHistory';

  import NProgress from 'nprogress';
  import NavBar from '$lib/components/NavBar.svelte';
  import LocomotiveScroll from 'locomotive-scroll';

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

  let main: HTMLElement;
  onMount(async () => {
    // dude.... why is this offsetting everything on refresh
    new LocomotiveScroll({
      el: main,
      smooth: true,
      multiplier: 2
    });

    await Promise.allSettled([
      source.initialize(),
      subscriptions.initialize(),
      unwatchedSubscriptions.initialize(),
      searchHistory.initialize()
    ]);
  });
</script>

<svelte:body
  on:keydown={e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      invalidateAll();
    }
  }}
/>

<main class="m-4 mb-20" bind:this={main}>
  <slot />
</main>

<NavBar />
