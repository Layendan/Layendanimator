<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import { convertAnime, downloads } from '$lib/model/downloads';
</script>

<GridContent>
  <svelte:fragment slot="title">Downloaded Animes</svelte:fragment>

  {#each Object.entries($downloads) as [id, { anime }] (id)}
    {#await convertAnime(anime)}
      <PlaceholderAnimeCard />
    {:then anime}
      <AnimeCard
        {anime}
        href="/library/downloads/{anime.source.id}/{anime.id}"
      />
    {/await}
  {:else}
    <p class="text-xl font-semibold text-base-content text-opacity-70">
      No Downloads
    </p>
  {/each}
</GridContent>
