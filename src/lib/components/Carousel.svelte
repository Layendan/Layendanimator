<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { preloadData } from '$app/navigation';
  import type { Anime } from '$lib/model/Anime';
  import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  export let animes: Anime[];
  export let fadeSpeed = 300;
  export let transitionTime = 10_000;
  export let animeIdx = 0;

  let fade = false;
  let interval = setInterval(next, transitionTime);
  async function next() {
    fade = true;
    await new Promise(resolve => setTimeout(resolve, fadeSpeed));
    animeIdx = (animeIdx + 1) % animes.length;
    fade = false;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      clearInterval(interval);
      interval = setInterval(next, transitionTime);
    } else {
      clearInterval(interval);
    }
  });

  $: if (animeIdx) {
    preloadData(`/${animes[animeIdx].id}`);
  }

  onMount(() => {
    preloadData(`/${animes[animeIdx].id}`);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  let scrollY = 0;
  $: textOn = scrollY <= 0;
</script>

<svelte:window bind:scrollY />

<header
  class={`relative -m-4 mb-4`}
  style="transform: translate3d(0, {scrollY / 1.5}px, 0);"
>
  <a href="/{animes[animeIdx].id}">
    <img
      class={`w-full h-96 object-cover 
      ${fade ? ' opacity-0 ' : 'opacity-100 '}
       transition-opacity duration-300 ease-in-out`}
      src={animes[animeIdx].cover}
      alt={animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
    />
  </a>
  <div class="absolute inset-0 scrim pointer-events-none" />
  <div
    class={`absolute inset-0 flex items-end bg-gradient-to-tr from-base-100
        ${fade ? '!opacity-0' : 'opacity-100'}
        ${textOn ? 'opacity-100' : '!opacity-0 pointer-events-none'} 
        transition-opacity duration-300 ease-in-out`}
  >
    <div
      class="flex-1 flex flex-col justify-center gap-y-4 p-4 max-w-lg lg:max-w-xl"
    >
      <h1
        class="text-3xl font-extrabold tracking-tight pb-1 md:text-4xl lg:text-5xl line-clamp-3 drop-shadow-lg"
      >
        {animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
      </h1>

      <p class="text-md md:text-lg lg:text-xl line-clamp-2 drop-shadow-lg">
        {animes[animeIdx].description.replace(/<[^>]+>/g, '').slice(0, 200)}
      </p>

      <div class="flex gap-x-2">
        <a
          class="flex gap-x-2 btn btn-primary px-8"
          href={`/${animes[animeIdx].id}`}
        >
          <Fa icon={faPlayCircle} size="lg" />
          Play
        </a>
        <a class="btn btn-outline" href={`/${animes[animeIdx].id}`}>
          Details
        </a>
      </div>
    </div>
  </div>
</header>

<style>
  .hide {
    @apply opacity-0 pointer-events-none;
  }
</style>
