<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import SubscriptionCarousel from '$lib/components/SubscriptionCarousel.svelte';
  import {
    convertAnime,
    downloads,
    type DownloadedAnime
  } from '$lib/model/downloads';
  import { watching } from '$lib/model/watch';
  import { derived } from 'svelte/store';

  const animes = derived<typeof downloads, DownloadedAnime>(
    downloads,
    ($downloads, set) => {
      Promise.all(
        Object.entries($downloads).map(async ([id, download]) => {
          const anime = await convertAnime(download.anime);
          return { id, result: { ...download, anime } };
        })
      ).then(async data => {
        const animes = data.reduce((acc, { id, result }) => {
          acc[id] = result;
          return acc;
        }, {} as DownloadedAnime);
        set(animes);
      });
    }
  );
</script>

<!-- Downloads -->
{#if window?.__TAURI__}
  <ScrollCarousel>
    <a
      slot="title"
      class="btn btn-ghost -m-2 h-max gap-4 p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/library/downloads"
    >
      Downloaded Animes
    </a>

    {#if !$animes}
      {#each Object.keys($downloads) as { }}
        <PlaceholderAnimeCard />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Downloads
          </p>
        </div>
      {/each}
    {:else}
      {#each Object.entries($animes) as [id, { anime }] (id)}
        <AnimeCard
          {anime}
          href="/library/downloads/{anime.source.id}/{anime.id}"
        />
      {/each}
    {/if}
  </ScrollCarousel>

  <div class="divider" />
{/if}

<!-- Recently Watched -->
<ScrollCarousel>
  <a
    slot="title"
    class="btn btn-ghost -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
    href="/library/recent"
  >
    Watch History
  </a>

  {#each Object.entries($watching).sort(([, a], [, b]) => b.watchTime - a.watchTime) as [id, anime] (id)}
    <AnimeCard {anime} extra={`Episode ${anime.watchEpisode.number}`} />
  {:else}
    <div class="flex items-center justify-center">
      <p
        class="text-xl font-semibold text-center text-base-content text-opacity-70"
      >
        No Recent Animes
      </p>
    </div>
  {/each}
</ScrollCarousel>

<div class="divider" />

<!-- Subscriptions -->
<SubscriptionCarousel />
