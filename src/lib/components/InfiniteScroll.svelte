<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import type { Anime } from '$lib/model/classes/Anime';
  import InfiniteScroll from 'svelte-infinite-scroll';

  export let animes: (Pick<Anime, 'id' | 'title' | 'image' | 'source'> &
    Partial<Anime>)[];
  export let dataUpdate: (
    page: number,
    perPage: number
  ) => Promise<typeof animes>;

  const perPage = 25;
  let page: number = Math.floor(animes.length / perPage) || 1;
  let hasMore: boolean = animes.length % perPage === 0;
  const main = document.querySelector('main');

  async function update() {
    page += 1;
    const result = await dataUpdate(page, perPage);
    console.debug(result);
    animes = [...animes, ...result].filter(
      (anime, index, self) =>
        self.findIndex(({ id }) => id === anime.id) === index
    );
    if (result.length < perPage) {
      hasMore = false;
    }
  }
</script>

<GridContent>
  <svelte:fragment slot="title"><slot /></svelte:fragment>

  {#each animes as anime (anime.id)}
    <AnimeCard {anime} />
  {/each}
</GridContent>

{#if hasMore}
  <div class="divider divider-vertical mt-8">
    <button class="btn btn-ghost text-2xl font-bold" on:click={update}>
      Scroll for More
    </button>
  </div>
{/if}

<InfiniteScroll
  elementScroll={main ?? undefined}
  {hasMore}
  on:loadMore={update}
/>
