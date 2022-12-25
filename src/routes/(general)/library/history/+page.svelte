<script lang="ts">
  import Anime from "$lib/components/Anime.svelte";
  import { history } from "$lib/model/history";
  import { fade } from "svelte/transition";
</script>

<main in:fade>
  <h1>History</h1>
  <span>
    {#each $history.browse as anime}
      <div>
        <Anime media={anime} expanded />
      </div>
    {:else}
      <p>No previously watched anime</p>
    {/each}
  </span>
</main>

<style>
  main {
    margin: 1rem;
    margin-top: 40px;
  }

  h1 {
    margin-bottom: 1rem;
  }

  span {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(480px, auto));
    justify-content: center;
    row-gap: 2.5rem;
  }

  p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
</style>
