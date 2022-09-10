<script>
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
</script>

<h1 in:fade>{$page.status}: {$page.error.message}</h1>

<style>
  h1 {
    width: 100vw;
    height: 100vh;
    font-size: 2rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
