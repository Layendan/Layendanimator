<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import { watching } from '$lib/model/watch';
</script>

<GridContent>
  <svelte:fragment slot="title">Recently Watched</svelte:fragment>

  <svelte:fragment slot="content">
    {#each Object.values($watching) as { anime, episode } (anime.id)}
      <AnimeCard {anime} extra={`Episode ${episode}`} />
    {:else}
      <p class="text-xl font-semibold text-base-content text-opacity-70">
        No Recent Animes
      </p>
    {/each}
  </svelte:fragment>
</GridContent>
