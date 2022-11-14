<script lang="ts">
  import { settings } from "$lib/model/settings";
  import { library } from "$lib/model/library";
  import "../app.css";
  import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
  import { getCurrent } from "@tauri-apps/api/window";
  import type { Anime } from "$lib/model/anime";
  import { history } from "$lib/model/history";
  import Footer from "$lib/components/footer/Footer.svelte";
  import type { ActiveSource } from "$lib/model/sources";
  import { onMount } from "svelte";

  export const ssr = false;

  let online: boolean;

  $library = {
    downloads:
      (JSON.parse(
        window.localStorage.getItem("library/downloads") ?? "null"
      ) as {
        anime: Anime;
        path: string;
      }[]) ?? [],
    subscriptions:
      (JSON.parse(
        window.localStorage.getItem("library/subscriptions") ?? "null"
      ) as {
        media: Anime;
        source?: ActiveSource;
      }[]) ?? [],
  };

  $history = {
    search:
      (JSON.parse(
        window.localStorage.getItem("history/search") ?? "null"
      ) as string[]) ?? [],
    browse:
      (JSON.parse(
        window.localStorage.getItem("history/browse") ?? "null"
      ) as Anime[]) ?? [],
  };

  getCurrent().onThemeChanged((event) => {
    console.log(`Theme changed to ${event.payload}`);
    $settings.theme.syncWithSystem &&
      ($settings.theme.appearance =
        (event.payload as "dark" | "light") ?? "light");
  });

  library.subscribe((item) => {
    window.localStorage.setItem(
      `library/subscriptions`,
      JSON.stringify(item.subscriptions)
    );
    window.localStorage.setItem(
      `library/downloads`,
      JSON.stringify(item.downloads)
    );
  });

  history.subscribe((item) => {
    window.localStorage.setItem(`history/search`, JSON.stringify(item.search));
    window.localStorage.setItem(`history/browse`, JSON.stringify(item.browse));
  });

  onMount(() => {
    invoke("close_splashscreen");
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
  class={$settings.theme.appearance === "custom"
    ? $settings.theme.custom?.name ?? "dark"
    : $settings.theme.appearance}
>
  <main>
    <slot />
  </main>

  <Footer />
</body>

<style>
  body {
    min-height: 100vh;
  }

  main {
    background-color: var(--primary-color);
    color: var(--text-color);
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 5rem;
  }
</style>
