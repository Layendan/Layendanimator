<script lang="ts">
  import { invalidateAll } from '$app/navigation';
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
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import PlaceholderCarousel from '$lib/components/PlaceholderCarousel.svelte';

  export let data: PageData;

  const MINUTE = 1000 * 60;
  const interval = setInterval(invalidateAll, MINUTE * 5);
  const placeholderNum = 10;

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<main class="relative w-full">
  <!-- Heading carousel -->
  {#await data.trending.data}
    <PlaceholderCarousel />
  {:then trending}
    <Carousel animes={trending.filter(a => a.cover && a.cover !== a.image)} />
  {/await}

  <!-- Recent episode carouse -->
  <ScrollCarousel>
    <svelte:fragment slot="title">Recent Episodes</svelte:fragment>

    <svelte:fragment slot="content">
      {#await data.recent.data}
        {#each new Array(placeholderNum) as _}
          <PlaceholderAnimeCard />
        {/each}
      {:then recent}
        {#each recent as anime (`${anime.id}/${anime.episodeNumber}`)}
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
      {:catch e}
        Error Loading Recent Episodes - {e}
      {/await}
    </svelte:fragment>
  </ScrollCarousel>

  <!-- Continue Watching -->
  {#if $watching.length > 0}
    <div class="divider" />

    <ScrollCarousel>
      <svelte:fragment slot="title">Continue Watching</svelte:fragment>

      <svelte:fragment slot="content">
        {#each $watching.slice(0, 10) as { anime, episode } (anime.id)}
          <AnimeCard {anime} extra={`Episode ${episode}`} deleteable />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}

  <div class="divider" />

  <!-- Subscriptions -->
  <ScrollCarousel>
    <svelte:fragment slot="title">Subscriptions</svelte:fragment>

    <svelte:fragment slot="content">
      {#each $unwatchedSubscriptions as { anime, newEpisodes } (anime.id)}
        <AnimeCard {anime} bind:numUpdates={newEpisodes} />
      {/each}

      {#if $unwatchedSubscriptions.length > 0 && $subscriptions.length > 0}
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

  <!-- Trending -->
  <ScrollCarousel>
    <svelte:fragment slot="title">Trending Animes</svelte:fragment>

    <svelte:fragment slot="content">
      {#await data.trending.data}
        {#each new Array(placeholderNum) as _}
          <PlaceholderAnimeCard />
        {/each}
      {:then trending}
        {#each trending as anime (anime.id)}
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
      {:catch e}
        Error Loading Trending Anime - {e}
      {/await}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />

  <!-- Popular -->
  <ScrollCarousel>
    <svelte:fragment slot="title">Popular Animes</svelte:fragment>

    <svelte:fragment slot="content">
      {#await data.popular.data}
        {#each new Array(placeholderNum) as _}
          <PlaceholderAnimeCard />
        {/each}
      {:then popular}
        {#each popular as anime (anime.id)}
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
      {:catch e}
        Error Loading Popular Anime - {e}
      {/await}
    </svelte:fragment>
  </ScrollCarousel>
</main>
