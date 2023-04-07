<script lang="ts">
  import { invalidate } from '$app/navigation';
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';
  import { onDestroy } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const MINUTE = 1000 * 60;
  const interval = setInterval(invalidate, MINUTE * 5);

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<main class="relative w-full">
  <!-- Heading carousel -->
  <Carousel animes={data.trending.filter(a => a.cover !== a.image)} />

  <!-- Recent episode carouse -->
  <ScrollCarousel>
    <svelte:fragment slot="title">Recent Episodes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.recent as anime (`${anime.id}/${anime.episodeNumber}`)}
        <AnimeCard {anime} extra={`Episode ${anime.episodeNumber}`} />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Recent Episodes Found
          </p>
        </div>
      {/each}
    </svelte:fragment>
  </ScrollCarousel>

  {#if $watching.length > 0}
    <div class="divider" />

    <ScrollCarousel>
      <svelte:fragment slot="title">Continue Watching</svelte:fragment>

      <svelte:fragment slot="content">
        {#each $watching as { anime, episode } (anime.id)}
          <AnimeCard {anime} extra={`Episode ${episode}`} deleteable />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}

  <div class="divider" />

  <ScrollCarousel>
    <svelte:fragment slot="title">Subscriptions</svelte:fragment>

    <svelte:fragment slot="content">
      {#each $unwatchedSubscriptions as { anime, newEpisodes } (anime.id)}
        <AnimeCard {anime} bind:numUpdates={newEpisodes} />
      {/each}
      {#if $unwatchedSubscriptions.length > 0}
        <div class="divider divider-horizontal" />
      {/if}
      {#each $subscriptions as anime (anime.id)}
        <AnimeCard {anime} />
      {/each}
      <!-- Can't use else since it can only check one and not both -->
      {#if $subscriptions.length === 0 && $unwatchedSubscriptions.length === 0}
        <div class="flex items-center justify-center">
          <p
            class="text-center text-xl font-semibold text-base-content text-opacity-70"
          >
            No Subscriptions Added
          </p>
        </div>
      {/if}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />

  <ScrollCarousel>
    <svelte:fragment slot="title">Trending Animes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.trending as anime (anime.id)}
        <AnimeCard {anime} />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Trending Animes Found
          </p>
        </div>
      {/each}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />

  <ScrollCarousel>
    <svelte:fragment slot="title">Popular Animes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.popular as anime (anime.id)}
        <AnimeCard {anime} />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Popular Animes Found
          </p>
        </div>
      {/each}
    </svelte:fragment>
  </ScrollCarousel>
</main>
