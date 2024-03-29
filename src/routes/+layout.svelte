<script lang="ts">
  import '../app.css';
  import '../nprogress.css';

  import {
    afterNavigate,
    beforeNavigate,
    goto,
    invalidateAll
  } from '$app/navigation';
  import { navigating, page } from '$app/stores';
  import NavBar from '$lib/components/NavBar.svelte';
  import NotificationPile from '$lib/components/NotificationPile.svelte';
  import {
    animeCache,
    clearCache,
    scrollY,
    scrollYCache
  } from '$lib/model/cache';
  import { connections } from '$lib/model/connections';
  import { createDefaultContextMenu } from '$lib/model/contextmenu';
  import { downloads } from '$lib/model/downloads';
  import { getOS } from '$lib/model/info';
  import { searchHistory } from '$lib/model/searchHistory';
  import { settings } from '$lib/model/settings';
  import { providers, source } from '$lib/model/source';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { encodeName, toStyleString } from '$lib/model/theme';
  import { updateSubscriptions } from '$lib/model/updates';
  import { watching } from '$lib/model/watch';
  import type { UnlistenFn } from '@tauri-apps/api/event';
  import type { OsType } from '@tauri-apps/api/os';
  import NProgress from 'nprogress';
  import { onDestroy, onMount, tick } from 'svelte';
  import { showMenu } from 'tauri-plugin-context-menu';

  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false
  });

  const MINUTE = 1000 * 60;
  let unsubscribe: NodeJS.Timeout | undefined = undefined;
  let tauriUnsubscribe: UnlistenFn;

  let obj: HTMLElement;

  beforeNavigate(() => scrollYCache.set($page.url.pathname, obj.scrollTop));

  afterNavigate(() => {
    obj.scrollTo(0, scrollYCache.get($page.url.pathname) ?? 0);
    $scrollY = obj.scrollTop;
  });

  $: if ($navigating) {
    NProgress.start();
  } else {
    NProgress.done();
  }

  let os: OsType | 'Unknown' = 'Unknown';
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

    const [{ listen }, { appWindow }, { invoke }] = await Promise.all([
      import('@tauri-apps/api/event'),
      import('@tauri-apps/api/window'),
      import('@tauri-apps/api/tauri')
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

    if ($settings.discordRPC === 'enabled') invoke('reset_activity');

    try {
      os = await getOS();
      isMac = os === 'Darwin';
    } catch {
      // Deprecated, would rather not use
      isMac = navigator?.platform?.includes('Mac');
    }

    // Workaround for Windows bug where there's a white box in the background
    // Start with decorations off, then turn them on after showing the window
    if (os === 'Windows_NT') {
      console.log('Windows detected, reanabling decorations');
      await tick();
      await Promise.all([appWindow.setDecorations(true), appWindow.maximize()]);
    }

    if (unsubscribe) clearInterval(unsubscribe);
    unsubscribe = setInterval(
      updateSubscriptions,
      animeCache.ttl ? animeCache.ttl + MINUTE : MINUTE * 31
    );
    updateSubscriptions();
    console.debug(
      'Subscriptions cache TTL:',
      animeCache.ttl ? animeCache.ttl + MINUTE : MINUTE * 31
    );
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

  async function contextMenu() {
    if (window.__TAURI__) {
      showMenu({
        items: await createDefaultContextMenu()
      });
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
  on:contextmenu|preventDefault={contextMenu}
/>

<span
  data-tauri-drag-region
  class="inline-flex h-screen w-screen gap-2 overflow-visible p-2
        {window?.__TAURI__ && os !== 'Linux'
    ? 'bg-transparent'
    : 'bg-base-100'}"
>
  <NavBar />
  <main
    class="relative h-full w-[calc(100%-214px-0.5rem)] overflow-y-scroll overscroll-contain rounded-md bg-base-100 shadow-xl shadow-black/40 will-change-scroll"
    id="main"
    bind:this={obj}
    on:scroll={() => ($scrollY = obj.scrollTop)}
  >
    <NotificationPile />
    <slot />
  </main>
</span>
