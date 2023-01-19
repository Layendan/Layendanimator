<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

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

{#if data.animes}
  <div class="divider" />
  <section
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none overscroll-x-contain"
  >
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      {data.query}
    </h1>
    <div
      class="relative inline-flex overflow-x-scroll whitespace-nowrap w-auto gap-6 p-4 pb-6"
    >
      {#each data.animes as anime}
        {#key anime.id}
          <AnimeCard {anime} />
        {/key}
      {:else}
        <div class="flex items-center justify-center">
          <p class="text-xl font-semibold text-center text-gray-500">
            No results found
          </p>
        </div>
      {/each}
    </div>
  </section>
{/if}
