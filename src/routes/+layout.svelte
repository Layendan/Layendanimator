<script lang="ts">
  import '../app.css';
  import '../nprogress.css';

  // import { invalidateAll } from '$app/navigation';
  import { navigating } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { source } from '$lib/model/source';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { searchHistory } from '$lib/model/searchHistory';

  import NProgress from 'nprogress';
  import NavBar from '$lib/components/NavBar.svelte';
  import LocomotiveScroll from 'locomotive-scroll';
  import { watched, watching } from '$lib/model/watch';
  import { goto, preloadData } from '$app/navigation';
  import { animeCache } from '$lib/model/cache';
  import { connections } from '$lib/model/connections';
  import { downloadedAnimes, downloads } from '$lib/model/downloads';

  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false
  });

  const MINUTE = 1000 * 60;
  let unsubscribe: NodeJS.Timer | undefined = undefined;

  $: {
    if ($navigating) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }

  let main: HTMLElement;
  onMount(async () => {
    new LocomotiveScroll({
      el: main,
      multiplier: 2
    });

    await Promise.allSettled([
      source.initialize(),
      subscriptions.initialize(),
      unwatchedSubscriptions.initialize(),
      watching.initialize(),
      watched.initialize(),
      searchHistory.initialize(),
      connections.initialize(),
      downloads.initialize(),
      downloadedAnimes.initialize()
    ]);

    const { listen } = await import('@tauri-apps/api/event');
    listen?.<string>('scheme-request-received', e => {
      if (e.payload) {
        goto(e.payload?.replace('layendanimator://', '/') ?? '/', {
          replaceState: true
        });
      }
    });

    if (unsubscribe) clearInterval(unsubscribe);
    unsubscribe = setInterval(() => {
      $unwatchedSubscriptions.forEach(({ anime: { id, status } }) => {
        if (status !== 'Completed' && status !== 'Cancelled')
          preloadData(`/${id}`);
      });
      $subscriptions.forEach(({ id, status }) => {
        if (status !== 'Completed' && status !== 'Cancelled')
          preloadData(`/${id}`);
      });
    }, animeCache.ttl || MINUTE * 30);
    console.log('Subscriptions cache TTL:', animeCache.ttl || MINUTE * 30);
  });

  onDestroy(() => {
    if (unsubscribe) clearInterval(unsubscribe);
  });
</script>

<svelte:body
  on:keydown={e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      window.location.reload();
      // invalidateAll();
    }
  }}
/>

<NavBar />

<main class="m-4 mb-20" bind:this={main}>
  <slot />
</main>
