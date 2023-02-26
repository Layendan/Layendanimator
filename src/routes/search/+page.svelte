<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { searchHistory } from '$lib/model/searchHistory';
  import { _toUpperCase } from './+page';
  import type { PageData } from './$types';
  import Fa from 'svelte-fa';
  import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
  export let data: PageData;

  let value = data.query ?? '';
</script>

<form
  on:submit|preventDefault={() => {
    const query = _toUpperCase(value.trim());
    if (!query) return;
    searchHistory.add(query);
    goto(`/search?q=${query}`);
  }}
  class="flex h-12 w-full items-center justify-center"
>
  <input
    type="search"
    placeholder="Search an anime"
    class="h-full flex-1 rounded-md bg-base-200 px-2 text-base shadow-md ring-2 ring-base-200 transition-shadow duration-200 focus:outline-none focus:ring-accent focus:ring-opacity-50"
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
    </svelte:fragment>
  </ScrollCarousel>
{:else}
  <section
    class="card max-w-none bg-base-200 bg-opacity-80 bg-clip-padding p-8 shadow-xl backdrop-blur-xl backdrop-filter"
  >
    <div class="mb-4 flex items-center justify-between gap-4">
      <h1 class="text-md font-extrabold  md:text-xl lg:text-2xl">History</h1>
    </div>
    <div class="relative flex w-auto flex-col p-4 pb-6">
      <!-- Can replace with $, but doing this so that it does not update while navigating -->
      {#each $searchHistory as query (query)}
        <div class="divider" />
        <div
          in:fade={{ duration: 200 }}
          class="flex items-center gap-2 p-2 text-2xl font-semibold"
        >
          <button
            on:click={() => searchHistory.remove(query)}
            class="hover:text-error"
          >
            <Fa icon={faXmarkCircle} />
          </button>

          <a
            href="/search?q={query}"
            class="max-w-max cursor-pointer hover:text-accent"
          >
            {query}
          </a>
        </div>
      {:else}
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          Such empty...
        </p>
      {/each}
    </div>
  </section>
{/if}
