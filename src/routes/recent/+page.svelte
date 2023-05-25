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

  async function update() {
    console.debug('Updating...');
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
    console.debug('Updated!');
  }
</script>

<GridContent>
  <svelte:fragment slot="title">Recent Episodes</svelte:fragment>

  <svelte:fragment slot="content">
    {#await data.data}
      {#each new Array(25) as _}
        <PlaceholderAnimeCard />
      {/each}
    {:then results}
      {#each results as anime (`${anime.id}/${anime.episodeNumber}`)}
        <AnimeCard {anime} extra={`Episode ${anime.episodeNumber}`} />
      {/each}
    {/await}
  </svelte:fragment>
</GridContent>

{#if hasMore}
  <div class="divider divider-vertical mt-8">
    <button class="btn-ghost btn text-2xl font-bold" on:click={update}>
      Scroll For More
    </button>
  </div>
{/if}

<InfiniteScroll window {hasMore} on:loadMore={update} />
