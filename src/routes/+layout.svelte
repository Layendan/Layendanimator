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
  import { watching } from '$lib/model/watch';
  import { goto, invalidateAll, preloadData } from '$app/navigation';
  import { animeCache, clearCache } from '$lib/model/cache';
  import { connections } from '$lib/model/connections';
  import { downloads } from '$lib/model/downloads';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import NotificationPile from '$lib/components/NotificationPile.svelte';
  import { settings } from '$lib/model/settings';
  import { toStyleString } from '$lib/model/theme';

  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false
  });

  const MINUTE = 1000 * 60;
  let unsubscribe: NodeJS.Timer | undefined = undefined;
  let tauriUnsubscribe: UnlistenFn;

  $: {
    if ($navigating) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }

  let main: HTMLElement;
  onMount(async () => {
    await Promise.allSettled([
      source.initialize(),
      subscriptions.initialize(),
      unwatchedSubscriptions.initialize(),
      watching.initialize(),
      settings.initialize(),
      searchHistory.initialize(),
      connections.initialize(),
      downloads.initialize()
    ]);

    const { listen } = await import('@tauri-apps/api/event');
    tauriUnsubscribe = await listen?.<string>('scheme-request-received', e => {
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
    console.debug('Subscriptions cache TTL:', animeCache.ttl || MINUTE * 30);
  });

  onDestroy(() => {
    if (unsubscribe) clearInterval(unsubscribe);
    tauriUnsubscribe();
  });

  $: if ($settings?.theme) {
    console.debug('Theme:', $settings.theme);
    const attr = document.createAttribute('data-theme');
    attr.value = $settings.theme.name;

    Object.keys($settings.themes).forEach(key => {
      document
        .querySelectorAll(`head > style#${key}`)
        ?.forEach(style => style.remove());
    });

    if ($settings.theme.name === 'dark' || $settings.theme.name === 'light') {
      document.documentElement.attributes.setNamedItem(attr);
    } else if ($settings.theme.name === 'system') {
      const attributes = document.documentElement.attributes;
      if (attributes.getNamedItem('data-theme'))
        attributes.removeNamedItem('data-theme');
    } else {
      const attributes = document.documentElement.attributes;
      if (attributes.getNamedItem('data-theme'))
        attributes.removeNamedItem('data-theme');

      if ($settings.theme.css) {
        const style = document.createElement('style');
        style.id = $settings.theme.name;
        style.innerHTML = `:root { ${toStyleString(
          $settings.theme.css,
          $settings.theme.colorScheme
        )} }`;
        document.head.appendChild(style);
      }
    }
  }
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

<NotificationPile />
