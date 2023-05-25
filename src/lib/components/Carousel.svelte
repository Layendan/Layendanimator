<script lang="ts">
  import { onDestroy } from 'svelte';
  import { preloadData } from '$app/navigation';
  import type { Anime } from '$lib/model/classes/Anime';
  import {
    faArrowLeft,
    faArrowRight,
    faPlayCircle
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { carouselPage } from '$lib/model/cache';
  import { fade } from 'svelte/transition';

  export let animes: Anime[];
  export let fadeSpeed = 300;
  export let transitionTime = 10_000;
  export let animeIdx = $carouselPage % (animes.length - 1);
  export let display: 'rails' | 'arrows' = 'arrows';
  let tempId = animeIdx;

  let doFade = false;
  let interval = setInterval(next, transitionTime);

  async function next() {
    await set(animeIdx + 1);
  }
  async function previous() {
    await set(animeIdx - 1);
  }

  async function set(idx: number) {
    if (idx === animeIdx) return;
    clearInterval(interval);
    interval = setInterval(next, transitionTime);
    tempId = idx < 0 ? animes.length - 1 : idx % animes.length;
    new Image().src = animes[tempId].cover; // preload image
    doFade = true;
    await new Promise(resolve => setTimeout(resolve, fadeSpeed));
    animeIdx = tempId;
    doFade = false;
  }

  $: preloadData(`/${animes[animeIdx].id}`);

  onDestroy(() => {
    $carouselPage = animeIdx;
    clearInterval(interval);
  });

  let scrollY = 0;
  $: textOn = scrollY <= 0;
</script>

<svelte:window bind:scrollY />

<svelte:document
  on:visibilitychange={() => {
    if (document.visibilityState === 'visible') {
      clearInterval(interval);
      interval = setInterval(next, transitionTime);
    } else {
      clearInterval(interval);
    }
  }}
/>

<header
  in:fade
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {scrollY <= 0 ? 0 : scrollY / 1.5}px, 0);"
>
  <a href="/{animes[animeIdx].id}">
    <img
      class="h-96 w-full object-cover
      {doFade ? 'motion-safe:opacity-0 ' : 'motion-safe:opacity-100 '}
       transition-opacity duration-300 ease-in-out"
      src={animes[animeIdx].cover}
      alt={animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
    />
  </a>
  <div class="scrim pointer-events-none absolute inset-0" />
  <div
    class="absolute inset-0 flex items-end bg-gradient-to-tr from-base-100/80
        {doFade ? 'motion-safe:!opacity-0' : 'motion-safe:opacity-100'}
        {textOn
      ? 'motion-safe:opacity-100'
      : 'motion-safe:pointer-events-none motion-safe:!opacity-0'} 
        transition-opacity duration-300 ease-in-out"
  >
    <div
      class="flex max-w-lg flex-1 flex-col justify-center gap-y-4 p-4 lg:max-w-xl"
    >
      <h1
        class="line-clamp-3 pb-1 text-3xl font-extrabold tracking-tight drop-shadow-lg md:text-4xl lg:text-5xl"
      >
        {animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
      </h1>

      <p class="text-md line-clamp-2 drop-shadow-lg md:text-lg lg:text-xl">
        {animes[animeIdx].description?.replace(/<[^>]+>/g, '').slice(0, 200) ??
          ''}
      </p>

      <div class="flex gap-x-2">
        <a
          class="btn-primary btn flex gap-x-2 px-8"
          href="/{animes[animeIdx].id}?autoplay=true"
        >
          <Fa icon={faPlayCircle} size="lg" />
          Play
        </a>
        <a class="btn-outline btn" href="/{animes[animeIdx].id}"> Details </a>
      </div>
    </div>
  </div>
  {#if display === 'rails'}
    <div
      class="absolute bottom-1 left-0 right-0 mx-auto flex w-min gap-x-1 transition-all duration-300 ease-in-out
    {textOn
        ? 'motion-safe:opacity-100'
        : 'motion-safe::pointer-events-none motion-safe:!opacity-0'}"
    >
      {#each animes.slice(0, 5) as anime, i}
        <button
          class="h-6 w-6 rounded-lg {i === tempId
            ? 'bg-accent'
            : 'bg-accent/10'}"
          on:click={() => set(i)}
        />
      {/each}
    </div>
  {:else}
    <div
      class="absolute bottom-4 right-4 w-max transition-all duration-300 ease-in-out
    {textOn
        ? 'motion-safe:opacity-100'
        : 'motion-safe::pointer-events-none motion-safe:!opacity-0'}"
    >
      <div class="flex">
        <button class="btn-ghost btn-square btn-sm btn" on:click={previous}>
          <Fa icon={faArrowLeft} size="1.2x" />
        </button>
        <button class="btn-ghost btn-square btn-sm btn" on:click={next}>
          <Fa icon={faArrowRight} size="1.2x" />
        </button>
      </div>
      <p class="w-full text-center font-bold">
        {tempId + 1} / {animes.length}
      </p>
    </div>
  {/if}
</header>
