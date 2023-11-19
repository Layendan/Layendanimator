<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { watching } from '$lib/model/watch';
  import { onDestroy, onMount } from 'svelte';
  import type { PageData } from './$types';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import PlaceholderCarousel from '$lib/components/PlaceholderCarousel.svelte';
  import SubscriptionCarousel from '$lib/components/SubscriptionCarousel.svelte';

  export let data: PageData;

  const MINUTE = 1000 * 60;
  const interval = setInterval(() => invalidate(data.source.id), MINUTE * 5);
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
</script>

<main class="relative w-full">
  {#if data.source.scripts.fetchTrendingAnime}
    <!-- Heading carousel -->
    {#await data.trending.data}
      <PlaceholderCarousel />
    {:then trending}
      <Carousel
        animes={trending
          .slice(0, 25)
          .filter(a => a.cover && a.cover !== a.image)}
        source={data.source}
      />
    {/await}
  {/if}

  <div class="m-4">
    {#if data.source.scripts.fetchRecentEpisodes}
      <!-- Recent episode carouse -->
      <ScrollCarousel>
        <a
          slot="title"
          class="btn btn-ghost -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
          href="/{data.source.id}/recent"
        >
          Recent Episodes
        </a>

        {#await data.recent.data}
          {#each new Array(placeholderNum) as { }}
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
      </ScrollCarousel>

      <div class="divider" />
    {/if}

    <!-- Continue Watching -->
    {#if Object.entries($watching).length > 0}
      <ScrollCarousel>
        <a
          slot="title"
          class="btn btn-ghost -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
          href="/library/recent"
        >
          Continue Watching
        </a>

        {#each Object.entries($watching)
          .sort(([, a], [, b]) => b.watchTime - a.watchTime)
          .slice(0, 10) as [id, anime] (id)}
          <AnimeCard {anime} extra={`Episode ${anime.watchEpisode.number}`} />
        {/each}
      </ScrollCarousel>

      <div class="divider" />
    {/if}

    <!-- Subscriptions -->
    <SubscriptionCarousel />

    {#if data.source.scripts.fetchTrendingAnime}
      <div class="divider" />

      <!-- Trending -->
      <ScrollCarousel>
        <a
          slot="title"
          class="btn btn-ghost -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
          href="/{data.source.id}/trending"
        >
          Trending Animes
        </a>

        {#await data.trending.data}
          {#each new Array(placeholderNum) as { }}
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
      </ScrollCarousel>
    {/if}

    {#if data.source.scripts.fetchPopularAnime}
      <div class="divider" />

      <!-- Popular -->
      <ScrollCarousel>
        <a
          slot="title"
          class="btn btn-ghost -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
          href="/{data.source.id}/popular"
        >
          Popular Animes
        </a>

        {#await data.popular.data}
          {#each new Array(placeholderNum) as { }}
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
      </ScrollCarousel>
    {/if}
  </div>
</main>
