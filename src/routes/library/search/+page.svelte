<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#each data.responses as { source, results }, i (source.id)}
  <ScrollCarousel>
    <a
      slot="title"
      class="btn btn-ghost -m-2 h-max gap-4 p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/{source.id}/search?q={data.query}"
    >
      {source.name}
    </a>

    {#await results}
      {#each Array(25) as { }}
        <PlaceholderAnimeCard />
      {/each}
    {:then results}
      {#each results as anime}
        <AnimeCard {anime} />
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Results
          </p>
        </div>
      {/each}
    {/await}
  </ScrollCarousel>

  {#if i < data.responses.length - 1}
    <div class="divider" />
  {/if}
{/each}
