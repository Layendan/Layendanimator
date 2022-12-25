<script lang="ts">
  import { settings } from "$lib/model/settings";
  import "../../app.css";
  import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
  import Footer from "$lib/components/footer/Footer.svelte";
  import { onMount } from "svelte";

  export const ssr = false;

  let online: boolean;

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

<main
  class={$settings.theme.appearance === "custom"
    ? $settings.theme.custom?.name ?? "dark"
    : $settings.theme.appearance}
>
  <div class="main">
    <slot />
  </div>

  <Footer />
</main>

<style>
  main {
    min-height: 100vh;
    overflow: hidden;
  }

  div.main {
    background: var(--primary-color);
    color: var(--text-color);
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 5rem;
    overflow: auto;
  }
</style>
