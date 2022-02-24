<script lang="ts">
  // Import required packages
  import Header from "$lib/header/Header.svelte";
  import "../app.css";
  import NProgress from "nprogress";
  import { navigating } from "$app/stores";
  import "$lib/components/nprogress.css";

  // Configure NProgress bar
  NProgress.configure({
    // Full list: https://github.com/rstacruz/nprogress#configuration
    minimum: 0.16,
    showSpinner: false,
    trickle: false,
  });
  $: {
    if ($navigating) {
      NProgress.start();
    }
    if (!$navigating) {
      NProgress.done();
    }
  }

  // To delete maybe
  let isHidden = false;
</script>

<Header {isHidden} />

<main>
  <slot />
</main>

<footer />

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    transform: translateY(-3em);

    color: white;

    transition: all 0.2s ease-in-out;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* padding-top: 40px;
    padding-left: 40px;
    padding-right: 40px; */

    color: white;
  }

  @media (min-width: 480px) {
    footer {
      padding: 40px 0;
    }
  }
</style>
