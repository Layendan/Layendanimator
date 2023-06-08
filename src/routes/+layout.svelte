<script lang="ts">
  import '../app.css';
  import '../nprogress.css';

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
  import { goto, invalidateAll, preloadData } from '$app/navigation';
  import { animeCache, clearCache } from '$lib/model/cache';
  import { connections } from '$lib/model/connections';
  import { downloads } from '$lib/model/downloads';

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
      downloads.initialize()
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
      Object.values($unwatchedSubscriptions).forEach(({ id, status }) => {
        if (status !== 'Completed' && status !== 'Cancelled')
          unwatchedSubscriptions.updateDate(id);
        preloadData(`/${id}`);
      });
      Object.values($subscriptions).forEach(({ id, status }) => {
        if (status !== 'Completed' && status !== 'Cancelled')
          subscriptions.updateDate(id);
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
      clearCache();
      invalidateAll();
    }
  }}
/>

<NavBar />

<main class="m-4 mb-20" id="main" bind:this={main}>
  <slot />
</main>
