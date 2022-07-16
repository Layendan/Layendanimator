<script lang="ts">
  // Import required packages
  import Header from "$lib/components/header/Header.svelte";
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

    color: var(--text-color);
  }

  footer {
    padding: 40px 0;
  }
</style>
