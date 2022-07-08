<script lang="ts">
  // Import required packages
  import Header from "$lib/components/header/Header.svelte";
  import "../app.css";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import "$lib/components/nprogress.css";
  import { settings } from "$lib/model/settings";
  import { onDestroy, onMount } from "svelte";
  import type { UnlistenFn } from "@tauri-apps/api/event";
  let convertFileSrc: typeof import("@tauri-apps/api/tauri").convertFileSrc;
  let listen: typeof import("@tauri-apps/api/event").listen;
  let unlisten: UnlistenFn;

  // Configure NProgress bar
  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false,
    trickle: true,
  });
  $: {
    if ($navigating) {
      NProgress.start();
      NProgress.set(0.2);
    }
    if (!$navigating) {
      NProgress.done();
    }
  }

  onMount(async () => {
    convertFileSrc = (await import("@tauri-apps/api/tauri")).convertFileSrc;
    listen = (await import("@tauri-apps/api/event")).listen;

    unlisten = await listen<string>("tauri://theme-changed", (event) => {
      console.log(`Theme changed to ${event.payload}`);
      $settings.theme.syncWithSystem &&
        ($settings.theme.appearance = event.payload as "dark" | "light");
    });
  });

  // removes the listener later
  onDestroy(async () => {
    await unlisten?.();
  });
</script>

<svelte:head>
  {#each $settings.customThemes as theme}
    <link
      rel="stylesheet"
      type="text/css"
      id={theme.name}
      href={convertFileSrc(theme.source)}
    />
  {/each}
</svelte:head>

<body
  class={$settings.theme.appearance === undefined
    ? $settings.theme.custom?.name
    : $settings.theme.appearance}
>
  <Header />

  <main>
    <slot />
  </main>

  <footer />
</body>

<style>
  main {
    color: var(--text-color);
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    transform: translateY(-3em);
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: var(--text-color);
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
