<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import { watching } from '$lib/model/watch';
</script>

<div class="m-4">
  <GridContent>
    <svelte:fragment slot="title">Watch History</svelte:fragment>

    {#each Object.entries($watching).sort(([, a], [, b]) => b.watchTime - a.watchTime) as [id, anime] (id)}
      <AnimeCard
        {anime}
        extra={`Episode ${anime.watchEpisode.number}`}
        showSource
      />
    {:else}
      <p class="text-xl font-semibold text-base-content text-opacity-70">
        No Recent Animes
      </p>
    {/each}
  </GridContent>
</div>
