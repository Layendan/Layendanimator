<script lang="ts">
  import Anime from "$lib/components/Anime.svelte";
  import { library } from "$lib/model/library";
</script>

<main>
  <h1>Downloads</h1>
  <span>
    {#each $library.downloads as { anime }}
      <Anime
        id={anime.id}
        name={anime.title.english ?? anime.title.romaji}
        thumbnail={anime.coverImage.large}
        description={anime.description}
        episodes={anime.streamingEpisodes}
        isNSFW={anime.isAdult}
      />
    {:else}
      <p>No Episodes Downloaded</p>
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
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    row-gap: 3rem;
  }

  p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
</style>
