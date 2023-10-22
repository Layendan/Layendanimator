<script lang="ts">
  import type { PageData } from './$types';
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import InfiniteScroll from 'svelte-infinite-scroll';

  export let data: PageData;

  const perPage = 25;
  let page: number = Math.floor(data.animes.length / perPage) || 1;
  let hasMore: boolean = data.animes.length % perPage === 0;
  const main = document.querySelector('main');

  async function update() {
    page += 1;
    const result = await data.update(page, perPage);
    console.debug(result);
    data.animes = [...data.animes, ...result].filter(
      (anime, index, self) =>
        self.findIndex(({ id }) => id === anime.id) === index
    );
    if (result.length < perPage) {
      hasMore = false;
    }
  }
</script>

<div class="m-4">
  <GridContent>
    <svelte:fragment slot="title">
      {data.source.name} - {data.query}
    </svelte:fragment>

    {#await data.animes}
      {#each Array(25) as { }}
        <PlaceholderAnimeCard />
      {/each}
    {:then animes}
      {#each animes as anime (anime.id)}
        <AnimeCard {anime} />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No results
          </p>
        </div>
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
