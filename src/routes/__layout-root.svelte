<script lang="ts">
  import { goto } from "$app/navigation";
  import { settings } from "$lib/model/settings";
  import { invoke } from "@tauri-apps/api/tauri";
  import type { UnlistenFn } from "@tauri-apps/api/event";
  import { onMount, onDestroy } from "svelte";
  import "../app.css";
  import "$lib/components/nprogress.css";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  let convertFileSrc: typeof import("@tauri-apps/api/tauri").convertFileSrc;
  let listen: typeof import("@tauri-apps/api/event").listen;
  let unlisten: UnlistenFn;

  let online: boolean;

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
    const rustOnline: boolean = await invoke("online");

    if (!online || !rustOnline) {
      console.error(
        "Page is Offline (navigator.onLine, tauri.online): ",
        online,
        rustOnline
      );
      goto("/library/downloads", { replaceState: true });
    }

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

<svelte:window
  bind:online
  on:offline={() => console.log("window has gone offline")}
  on:online={() => console.log("window is back online")}
/>

<body
  class={$settings.theme.appearance === undefined
    ? $settings.theme.custom?.name
    : $settings.theme.appearance}
>
  <slot />
</body>
