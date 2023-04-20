<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { downloadedAnimes } from '$lib/model/downloads';
</script>

<ScrollCarousel>
  <svelte:fragment slot="title">Downloaded Animes</svelte:fragment>

  <svelte:fragment slot="content">
    {#each $downloadedAnimes as { anime } (anime.id)}
      <AnimeCard {anime} />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No downloads
        </p>
      </div>
    {/each}
  </svelte:fragment>
</ScrollCarousel>
