<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { fade, fly } from 'svelte/transition';
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
  class="flex items-center justify-center w-full h-12"
>
  <input
    type="search"
    placeholder="Search an anime"
    class="flex-1 h-full px-2 text-base bg-base-200 rounded-md shadow-md focus:outline-none ring-2 ring-base-200 focus:ring-accent focus:ring-opacity-50 transition-shadow duration-200"
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
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none"
  >
    <div class="flex items-center justify-between gap-4 mb-4">
      <h1 class="text-md font-extrabold  md:text-xl lg:text-2xl">History</h1>
    </div>
    <div class="relative flex flex-col w-auto p-4 pb-6">
      <!-- Can replace with $, but doing this so that it does not update while navigating -->
      {#each $searchHistory as query (query)}
        <div class="divider" />
        <div
          in:fade={{ duration: 200 }}
          out:fly={{ duration: 300, x: 500 }}
          class="flex items-center gap-2 p-2 text-2xl font-semibold"
        >
          <button
            on:click={() => searchHistory.remove(query)}
            class="hover:text-red-500"
          >
            <Fa icon={faXmarkCircle} />
          </button>

          <a
            href="/search?q={query}"
            class="hover:text-accent cursor-pointer max-w-max"
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
