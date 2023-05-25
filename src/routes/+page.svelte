<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';
  import { onDestroy, onMount } from 'svelte';
  import type { PageData } from './$types';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import PlaceholderCarousel from '$lib/components/PlaceholderCarousel.svelte';
  import { getSortMethod, settings } from '$lib/model/settings';

  export let data: PageData;

  const MINUTE = 1000 * 60;
  const interval = setInterval(invalidateAll, MINUTE * 5);
  const placeholderNum = 25;

  onMount(() => {
    if (!navigator?.onLine) {
      goto(window?.__TAURI__ ? '/library/downloads' : '/library', {
        replaceState: true
      });
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  $: sortMethod = ($settings.sortSubscriptions, getSortMethod());
</script>

<main class="relative w-full">
  <!-- Heading carousel -->
  {#await data.trending.data}
    <PlaceholderCarousel />
  {:then trending}
    <Carousel
      animes={trending.slice(0, 25).filter(a => a.cover && a.cover !== a.image)}
    />
  {/await}

  <!-- Recent episode carouse -->
  <ScrollCarousel>
    <a
      slot="title"
      class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/recent"
    >
      Recent Episodes
    </a>

    <svelte:fragment slot="content">
      {#await data.recent.data}
        {#each new Array(placeholderNum) as _}
          <PlaceholderAnimeCard />
        {/each}
      {:then recent}
        {#each recent.slice(0, 25) as anime (`${anime.id}/${anime.episodeNumber}`)}
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
  {#if Object.entries($watching).length > 0}
    <div class="divider" />

    <ScrollCarousel>
      <a
        slot="title"
        class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
        href="/library/recent"
      >
        Continue Watching
      </a>

      <svelte:fragment slot="content">
        {#each Object.values($watching).slice(0, 10) as { anime, episode } (anime.id)}
          <AnimeCard {anime} extra={`Episode ${episode}`} deleteable />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}

  <div class="divider" />

  <!-- Subscriptions -->
  <ScrollCarousel>
    <a
      slot="title"
      class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/library/subscriptions"
    >
      Subscriptions
    </a>

    <svelte:fragment slot="content">
      {#each Object.values($unwatchedSubscriptions).sort(sortMethod) as anime (anime.id)}
        <AnimeCard {anime} bind:numUpdates={anime.newEpisodes} />
      {/each}

      {#if Object.entries($unwatchedSubscriptions).length > 0 && Object.entries($subscriptions).length > 0}
        <div class="divider divider-horizontal" />
      {/if}

      {#each Object.values($subscriptions).sort(sortMethod) as anime (anime.id)}
        <AnimeCard {anime} />
      {/each}

      <!-- Can't use else since it can only check one and not both -->
      {#if Object.entries($subscriptions).length === 0 && Object.entries($unwatchedSubscriptions).length === 0}
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
    <a
      slot="title"
      class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/trending"
    >
      Trending Animes
    </a>

    <svelte:fragment slot="content">
      {#await data.trending.data}
        {#each new Array(placeholderNum) as _}
          <PlaceholderAnimeCard />
        {/each}
      {:then trending}
        {#each trending.slice(0, 25) as anime (anime.id)}
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
    <a
      slot="title"
      class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/popular"
    >
      Popular Animes
    </a>

    <svelte:fragment slot="content">
      {#await data.popular.data}
        {#each new Array(placeholderNum) as _}
          <PlaceholderAnimeCard />
        {/each}
      {:then popular}
        {#each popular.slice(0, 25) as anime (anime.id)}
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
