<script lang="ts">
  import { slide } from "svelte/transition";
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<div class="content" transition:slide>
  <h1>About this app</h1>

  <p>
    This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your
    own by typing the following into your command line and following the prompts:
  </p>

  <!-- TODO lose the @next! -->
  <pre>npm init svelte@next</pre>

  <p>
    The page you're looking at is purely static HTML, with no client-side
    interactivity needed.
  </p>

  <p>
    The <a href="/todos">TODOs</a> page illustrates SvelteKit's data loading and
    form handling.
  </p>
</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: var(--column-margin-top) auto 0 auto;
  }
</style>
