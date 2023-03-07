<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<ScrollCarousel>
  <svelte:fragment slot="title">{data.query}</svelte:fragment>

  <svelte:fragment slot="content">
    {#each data.animes as anime (anime.id)}
      <AnimeCard {anime} />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No results
        </p>
      </div>
    {/each}
  </svelte:fragment>
</ScrollCarousel>
