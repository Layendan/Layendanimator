<script lang="ts">
  import { settings } from "$lib/model/settings";
  import "../app.css";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { getCurrent } from "@tauri-apps/api/window";

  let online: boolean;

  getCurrent().onThemeChanged((event) => {
    console.log(`Theme changed to ${event.payload}`);
    $settings.theme.syncWithSystem &&
      ($settings.theme.appearance =
        (event.payload as "dark" | "light") ?? "light");
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
    ? $settings.theme.custom?.name
    : $settings.theme.appearance}
>
  <slot />
</body>

<style>
  body {
    min-height: 100vh;
  }
</style>
