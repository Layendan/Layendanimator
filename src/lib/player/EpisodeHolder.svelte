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
  <hr class="solid" />
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
  }

  hr.solid {
    margin-top: 20px;
    /* border-top: 1px solid rgba(66, 66, 66, 0.5); */
    border-color: #555;
    /* box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5); */
  }
</style>
