<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import {
    convertAnime,
    downloads,
    type DownloadedAnime
  } from '$lib/model/downloads';
  import { derived } from 'svelte/store';

  // TODO: Make this only reduce and not map
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

<GridContent>
  <svelte:fragment slot="title">Downloaded Animes</svelte:fragment>

  {#if !$animes}
    {#each Object.keys($downloads) as { }}
      <PlaceholderAnimeCard />
    {:else}
      <p class="text-xl font-semibold text-base-content text-opacity-70">
        No Downloads
      </p>
    {/each}
  {:else}
    {#each Object.entries($animes) as [id, { anime }] (id)}
      <AnimeCard
        {anime}
        href="/library/downloads/{anime.source.id}/{anime.id}"
        isDownload
      />
    {/each}
  {/if}
</GridContent>
