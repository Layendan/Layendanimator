<script lang="ts">
  import type { PageData } from './$types';
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import InfiniteScroll from 'svelte-infinite-scroll';

  export let data: PageData;

  let isUpdating = false;
  const perPage = 25;
  let page: number = Math.floor(data.data.length / perPage) || 1;
  let hasMore: boolean = data.data.length % perPage === 0;
  const main = document.querySelector('main');

  async function update() {
    isUpdating = true;
    page += 1;
    const result = await data.update(page, perPage);
    console.debug(result);
    data.data = [...data.data, ...result].filter(
      (anime, index, self) =>
        self.findIndex(
          ({ id, episodeNumber }) =>
            `${id}/${episodeNumber}` === `${anime.id}/${anime.episodeNumber}`
        ) === index
    );
    if (result.length < perPage) {
      hasMore = false;
    }
    isUpdating = false;
  }
</script>

<div class="m-4">
  <GridContent>
    <svelte:fragment slot="title">Recent Episodes</svelte:fragment>

    {#await data.data}
      {#each new Array(25) as { }}
        <PlaceholderAnimeCard />
      {/each}
    {:then results}
      {#each results as anime (`${anime.id}/${anime.episodeNumber}`)}
        <AnimeCard {anime} extra={`Episode ${anime.episodeNumber}`} />
      {/each}
    {/await}
  </GridContent>

  {#if hasMore}
    <div class="divider divider-vertical mt-8">
      <button class="btn btn-ghost text-2xl font-bold" on:click={update}>
        Scroll For More
      </button>
    </div>
  {/if}
</div>

<InfiniteScroll
  elementScroll={main ?? undefined}
  {hasMore}
  on:loadMore={update}
/>
