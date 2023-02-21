<script lang="ts">
  import Play from './svg/Play.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { goto, preloadData } from '$app/navigation';
  import type { Anime } from '$lib/model/Anime';

  export let animes: Anime[];
  let scrollY = 0;
  let current = 0;
  let interval = setInterval(next, 15000);

  function next() {
    current = (current + 1) % animes.length;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      clearInterval(interval);
      interval = setInterval(next, 15000);
    } else {
      clearInterval(interval);
    }
  });

  $: if (current) {
    preloadData(`/${animes[current].id}`);
  }

  onMount(() => {
    preloadData(`/${animes[current].id}`);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<svelte:window bind:scrollY />

<header class="relative -m-4 mb-4 z-0" style="top: {scrollY / 1.5}px;">
  {#key current}
    <a href="/{animes[current].id}">
      <img
        in:fade|local={{ duration: 1000 }}
        class="w-full h-[45vh] object-cover"
        src={animes[current].cover}
        alt={animes[current].title.english ?? animes[current].title.romaji}
      />
    </a>
  {/key}
  <div class="absolute inset-0 scrim pointer-events-none" />
  {#if scrollY <= 0}
    <div
      class="absolute inset-0 pb-4 pl-4 bg-gradient-to-r from-base-100 w-full h-full"
      transition:fade|local
    >
      {#key current}
        <div
          in:fade|local
          class="flex flex-col justify-center h-full w-5/12 gap-4 p-4"
        >
          <h1 class="text-4xl font-bold line-clamp-3">
            {animes[current].title.english ?? animes[current].title.romaji}
          </h1>
          <p class="text-xl line-clamp-2">
            {@html animes[current].description}
          </p>
          <div class="flex gap-4">
            <!-- TODO: Actually play episode -->
            <button
              class="btn btn-primary"
              on:click={() => goto(`/${animes[current].id}`)}
            >
              <Play width={24} height={24} />
              Play
            </button>
            <button
              class="btn btn-outline"
              on:click={() => goto(`/${animes[current].id}`)}
            >
              Details
            </button>
          </div>
        </div>
      {/key}
    </div>
  {/if}
</header>
