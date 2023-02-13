<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import X from '$lib/components/svg/X.svelte';
  import Trash from '$lib/components/svg/Trash.svelte';
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { searchHistory } from '$lib/model/searchHistory';
  import { _toUpperCase } from './+page';
  import type { PageData } from './$types';

  export let data: PageData;

  let value = data.query ?? '';
</script>

<form
  on:submit|preventDefault={() => {
    const query = _toUpperCase(value.trim());
    if (query) {
      goto(`/search?q=${query}`);
      searchHistory.add(query);
    }
  }}
  class="flex items-center justify-center w-full h-12"
>
  <input
    type="search"
    placeholder="Search an anime"
    class="w-full h-full px-2 text-base bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-80 rounded-md shadow-md focus:outline-none ring-2 ring-base-200 focus:ring-accent focus:ring-opacity-50 transition-shadow duration-200"
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
    <div class="flex items-center gap-4 mb-4">
      <h1
        class="text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Episodes
      </h1>
      {#if $searchHistory.length > 0}
        <button
          transition:fade|local={{ duration: 200 }}
          class="btn btn-outline btn-accent w-fit"
          on:click={() => searchHistory.clear()}
        >
          <Trash width={20} height={20} />
        </button>
      {/if}
    </div>
    <div class="relative flex flex-col w-auto p-4 pb-6">
      <!-- Can replace with $, but doing this so that it does not update while navigating -->
      {#each $searchHistory as query}
        <div class="divider" />
        <div
          in:fade={{ duration: 200 }}
          class="flex gap-1 p-2 text-xl font-semibold text-base-content group transition-colors duration-200"
        >
          <X
            width={18}
            height={18}
            on:click={() => searchHistory.remove(query)}
          />
          <a
            href="/search?q={query}"
            class="hover:text-accent cursor-pointer w-full"
          >
            {query}
          </a>
        </div>
      {:else}
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No previous searches
        </p>
      {/each}
    </div>
  </section>
{/if}
