<script lang="ts">
  import { preloadData } from '$app/navigation';
  import { carouselPage } from '$lib/model/cache';
  import type { Anime } from '$lib/model/classes/Anime';
  import { settings } from '$lib/model/settings';
  import type { Provider } from '$lib/model/source';
  import {
    faArrowLeft,
    faArrowRight,
    faPlayCircle
  } from '@fortawesome/free-solid-svg-icons';
  import { onDestroy, onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';
  import AnimeContextMenu from './AnimeContextMenu.svelte';

  export let animes: Anime[];
  export let source: Provider;
  export let fadeSpeed = 300;
  export let transitionTime = 10_000;
  export let display: 'rails' | 'arrows' = 'arrows';
  $: animeIdx = ($carouselPage[source.id] ?? 0) % (animes.length - 1);
  $: tempId = animeIdx;

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

  $: preloadData(
    `/${animes[animeIdx].source.id}/${animes[animeIdx].id}?autoplay=true`
  );

  onDestroy(() => {
    $carouselPage[source.id] = animeIdx;
    clearInterval(interval);
  });

  let scrollY = 0;
  $: textOn = scrollY <= 0;

  let element: HTMLElement;

  onMount(() =>
    element.addEventListener('focusin', () =>
      window.scroll({ top: 0, left: 0, behavior: 'smooth' })
    )
  );

  let imageLoaded = true;
  let skeleton = true;

  $: if (animeIdx) {
    imageLoaded = true;
    skeleton = true;
  }
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
  bind:this={element}
  class="relative -m-4 mb-4 h-[60vh] w-screen ease-in-out will-change-transform motion-reduce:!translate3d-y-0"
  class:!translate3d-y-0={!$settings.parallax}
  style="transform: translate3d(0, {Math.max(scrollY / 1.5, 0)}px, 0);"
>
  {#key animeIdx}
    <img
      in:fade
      src={imageLoaded
        ? animes[animeIdx].cover
        : '/assets/loading_failure.jpeg'}
      alt={animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
      on:error|once={() => (imageLoaded = false)}
      on:load|once={() => (skeleton = false)}
      class="h-[60vh] w-full object-cover
    {doFade ? 'motion-safe:opacity-0 ' : 'motion-safe:opacity-100 '}
     transition-opacity duration-300 ease-in-out"
      class:skeleton
    />
  {/key}
  <div class="scrim pointer-events-none absolute inset-0 translate-y-1" />
  <div
    class="absolute inset-0 flex items-end bg-gradient-to-tr from-base-100/50
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
          class="btn btn-primary flex gap-x-2 px-8"
          href="/{animes[animeIdx].source.id}/{animes[animeIdx]
            .id}?autoplay=true"
        >
          <Fa icon={faPlayCircle} size="lg" />
          Watch
        </a>
        <a
          class="btn btn-outline"
          href="/{animes[animeIdx].source.id}/{animes[animeIdx].id}"
        >
          Details
        </a>
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
          aria-label="Select {anime.title.english ?? anime.title.romaji}"
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
        <button
          class="btn btn-square btn-ghost btn-sm"
          aria-label="Previous Featured Anime"
          on:click={previous}
        >
          <Fa icon={faArrowLeft} size="1.2x" />
        </button>
        <button
          class="btn btn-square btn-ghost btn-sm"
          aria-label="Next Featured Anime"
          on:click={next}
        >
          <Fa icon={faArrowRight} size="1.2x" />
        </button>
      </div>
      <p class="w-full text-center font-bold">
        {tempId + 1} / {animes.length}
      </p>
    </div>
  {/if}
</header>

{#key tempId}
  <AnimeContextMenu anime={animes[animeIdx]} {element} />
{/key}
