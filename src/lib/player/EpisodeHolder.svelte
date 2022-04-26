<script lang="ts">
  import Episode from "./Episode.svelte";

  export let episodes: Array<any> = [];
</script>

<main>
  <!-- vertically lists all of the episodes -->
  <ul class="episode-list">
    {#each episodes as episode}
      <li>
        <Episode {episode} />
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    margin: 0;
    padding: 0;
  }
  .episode-list {
    display: flex;
    flex-direction: column;
    /* https://developer.mozilla.org/en-US/docs/Web/CSS/list-style */
    list-style: none;
    margin: 0;
    padding: 0;
    padding-top: 1em;
  }
</style>
