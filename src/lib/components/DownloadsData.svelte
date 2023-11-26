<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import {
    convertAnime,
    downloads,
    type DownloadedDict
  } from '$lib/model/downloads';
  import { derived } from 'svelte/store';

  // TODO: Make this only reduce and not map
  const animes = derived<typeof downloads, DownloadedDict>(
    downloads,
    ($downloads, set) => {
      Promise.all(
        Object.entries($downloads).map(async ([id, download]) => {
          const anime = await convertAnime(download.anime);
          return { id, result: { ...download, anime } };
        })
      ).then(data => {
        const animes = data.reduce((acc, { id, result }) => {
          acc[id] = result;
          return acc;
        }, {} as DownloadedDict);
        set(animes);
      });
    }
  );
</script>

{#if Object.keys($animes ?? {}).length === 0}
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
      showSource
    />
  {/each}
{/if}
