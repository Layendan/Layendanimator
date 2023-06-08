<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import { watching } from '$lib/model/watch';
</script>

<GridContent>
  <svelte:fragment slot="title">Recently Watched</svelte:fragment>

  <svelte:fragment slot="content">
    {#each Object.values($watching)
      .sort((a, b) => b.watchTime - a.watchTime)
      .slice(0, 10) as anime (anime.id)}
      <AnimeCard {anime} extra={`Episode ${anime.watchEpisode}`} />
    {:else}
      <p class="text-xl font-semibold text-base-content text-opacity-70">
        No Recent Animes
      </p>
    {/each}
  </svelte:fragment>
</GridContent>
