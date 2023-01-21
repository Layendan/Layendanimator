<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<header class="relative m-[-1rem] mb-8 z-0" style="top: {scrollY / 1.5}px;">
  <Carousel bind:animes={data.popular} />
</header>

<main class="relative w-full">
  <ScrollCarousel>
    <svelte:fragment slot="title">Recent Episodes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.recent as anime}
        <AnimeCard {anime} />
      {/each}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />

  <ScrollCarousel>
    <svelte:fragment slot="title">Popular Animes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.popular as anime}
        <AnimeCard {anime} />
      {/each}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />

  <ScrollCarousel>
    <svelte:fragment slot="title">Trending Animes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.trending as anime}
        <AnimeCard {anime} />
      {/each}
    </svelte:fragment>
  </ScrollCarousel>
</main>
