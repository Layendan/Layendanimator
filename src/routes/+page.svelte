<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import type { PageData } from './$types';

  export let data: PageData;
  let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<header class="relative m-[-1rem] mb-4 z-0" style="top: {scrollY / 1.5}px;">
  <Carousel
    animes={[
      ...data.trending.filter(a => a.cover !== a.image),
      ...data.popular
    ]}
  />
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
    <svelte:fragment slot="title">Subscriptions</svelte:fragment>

    <svelte:fragment slot="content">
      {#each $unwatchedSubscriptions as { anime, newEpisodes }}
        <AnimeCard {anime} bind:numUpdates={newEpisodes} />
      {/each}
      {#each $subscriptions.filter(e => !$unwatchedSubscriptions.some(a => a.anime.id === e.id)) as anime}
        <AnimeCard {anime} />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Subscriptions Added
          </p>
        </div>
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
