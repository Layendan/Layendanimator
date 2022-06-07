<script lang="ts">
  // Import required packages
  import Header from "$lib/components/header/Header.svelte";
  import "../app.css";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import "$lib/components/nprogress.css";

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
</script>

<Header />

<main>
  <slot />
</main>

<footer />

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
    /* padding-top: 40px;
    padding-left: 40px;
    padding-right: 40px; */

    color: var(--text-color);
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
