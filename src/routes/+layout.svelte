<script lang="ts">
  import '../app.css';
  import '../nprogress.css';

  import { navigating, page } from '$app/stores';
  import { searchHistory } from '$lib/model/searchHistory';
  import { providers, source } from '$lib/model/source';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { onDestroy, onMount } from 'svelte';

  import { goto, invalidateAll, preloadData } from '$app/navigation';
  import NavBar from '$lib/components/NavBar.svelte';
  import NotificationPile from '$lib/components/NotificationPile.svelte';
  import { animeCache, clearCache } from '$lib/model/cache';
  import { connections } from '$lib/model/connections';
  import { downloads } from '$lib/model/downloads';
  import { getOS } from '$lib/model/info';
  import { settings } from '$lib/model/settings';
  import { encodeName, toStyleString } from '$lib/model/theme';
  import { watching } from '$lib/model/watch';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import NProgress from 'nprogress';

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

  let isMac = navigator?.platform?.includes('Mac') ?? false;

  onMount(async () => {
    await Promise.allSettled([
      source.initialize(),
      providers.initialize(),
      subscriptions.initialize(),
      unwatchedSubscriptions.initialize(),
      watching.initialize(),
      settings.initialize(),
      searchHistory.initialize(),
      connections.initialize(),
      downloads.initialize()
    ]);

    const [{ listen }, { appWindow }] = await Promise.all([
      import('@tauri-apps/api/event'),
      import('@tauri-apps/api/window')
    ]);

    tauriUnsubscribe = (
      await Promise.all([
        listen?.<string>('scheme-request-received', e => {
          if (e.payload) {
            goto(
              e.payload?.replace('layendanimator://', '/') ?? `/${$source.id}`,
              {
                replaceState: true
              }
            );
          }
        }),
        appWindow.show(),
        appWindow.setSkipTaskbar(false)
      ])
    )[0];

    try {
      isMac = (await getOS()) === 'Darwin';
    } catch {
      // Deprecated, would rather not use
      isMac = navigator.platform.includes('Mac');
    }

    if (unsubscribe) clearInterval(unsubscribe);
    unsubscribe = setInterval(
      () => {
        Object.values($unwatchedSubscriptions).forEach(anime => {
          if (anime.status !== 'Completed' && anime.status !== 'Cancelled')
            unwatchedSubscriptions.updateDate(anime);
          preloadData(`/${anime.source.id}/${anime.id}`);
        });
        Object.values($subscriptions).forEach(anime => {
          if (anime.status !== 'Completed' && anime.status !== 'Cancelled')
            subscriptions.updateDate(anime);
          preloadData(`/${anime.source.id}/${anime.id}`);
        });
      },
      animeCache.ttl || MINUTE * 30
    );
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
        .querySelectorAll(`head > style#${encodeName(key)}`)
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
        style.id = encodeName($settings.theme.name);
        style.innerHTML = `:root { ${toStyleString(
          $settings.theme.css,
          $settings.theme.colorScheme
        )} }`;
        document.head.appendChild(style);
      }
    }
  }
</script>

<svelte:window
  on:keydown={e => {
    if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'r') {
      e.preventDefault();
      clearCache();
      invalidateAll();
      if (e.shiftKey) location.reload();
    }
  }}
  on:contextmenu|preventDefault
/>

<NavBar source={$providers[$page.params.source] ?? $source} />

<main class="m-4" id="main">
  <slot />
</main>

<NotificationPile />
