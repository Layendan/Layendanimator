<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';

  export let data: PageData;

  let value = data.query ?? '';
</script>

<form
  on:submit|preventDefault={() => {
    if (value) {
      goto(`/search?q=${value}`);
    }
  }}
  class="flex items-center justify-center w-full h-12"
>
  <input
    type="search"
    placeholder="Search an anime"
    class="w-full h-full px-2 text-base bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-60 rounded-md shadow-md focus:outline-none ring-2 ring-base-200 focus:ring-accent focus:ring-opacity-50 transition-shadow duration-300"
    autocomplete="off"
    autocapitalize="words"
    bind:value
  />
</form>

<div class="divider" />

{#if data.animes}
  <ScrollCarousel>
    <svelte:fragment slot="title">{data.query}</svelte:fragment>

    <svelte:fragment slot="content">
      {#each data.animes as anime}
        {#key anime.id}
          <AnimeCard {anime} />
        {/key}
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No results found
          </p>
        </div>
      {/each}
    </svelte:fragment>
  </ScrollCarousel>
{:else}
  <section
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none"
  >
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Previous Searches
    </h1>
    <div class="relative flex flex-col w-auto p-4 pb-6">
      <div class="divider" />
      <!-- TODO: Replace with actual search history -->
      {#each ['Test', 'My Hero Academia', 'One Piece', 'Hgurowgusgfisghwufhbwsvf'] as query}
        <a
          class="flex gap-1 p-2 cursor-pointer text-xl font-semibold text-base-content hover:text-accent transition-colors duration-300"
          href="/search?q={query}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="inline-flex self-center"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 16 16 12 12 8" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          {query}
        </a>
        <div class="divider" />
      {/each}
    </div>
  </section>
{/if}
