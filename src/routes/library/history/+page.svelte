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
        <Anime media={anime} />
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
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 1rem;
    row-gap: 3rem;
    margin-left: auto;
    margin-right: auto;
  }

  p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
</style>
