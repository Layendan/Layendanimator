<script lang="ts">
  import { onDestroy } from 'svelte';
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

  $: preloadData(`/${animes[animeIdx].id}`);

  onDestroy(() => {
    clearInterval(interval);
  });

  let scrollY = 0;
  $: textOn = scrollY <= 0;
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {scrollY < 0 ? 0 : scrollY / 1.5}px, 0);"
>
  <a href="/{animes[animeIdx].id}">
    <img
      class="h-96 w-full object-cover 
      {fade ? 'motion-safe:opacity-0 ' : 'motion-safe:opacity-100 '}
       transition-opacity duration-300 ease-in-out"
      src={animes[animeIdx].cover}
      alt={animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
    />
  </a>
  <div class="scrim pointer-events-none absolute inset-0" />
  <div
    class="absolute inset-0 flex items-end bg-gradient-to-tr from-base-100
        {fade ? 'motion-safe:!opacity-0' : 'motion-safe:opacity-100'}
        {textOn
      ? 'motion-safe:opacity-100'
      : 'motion-safe::pointer-events-none motion-safe:!opacity-0'} 
        transition-opacity duration-300 ease-in-out"
  >
    <div
      class="flex max-w-lg flex-1 flex-col justify-center gap-y-4 p-4 lg:max-w-xl"
    >
      <h1
        class="pb-1 text-3xl font-extrabold tracking-tight drop-shadow-lg line-clamp-3 md:text-4xl lg:text-5xl"
      >
        {animes[animeIdx].title.english ?? animes[animeIdx].title.romaji}
      </h1>

      <p class="text-md drop-shadow-lg line-clamp-2 md:text-lg lg:text-xl">
        {animes[animeIdx].description.replace(/<[^>]+>/g, '').slice(0, 200)}
      </p>

      <div class="flex gap-x-2">
        <a
          class="btn-primary btn flex gap-x-2 px-8"
          href="/{animes[animeIdx].id}"
        >
          <Fa icon={faPlayCircle} size="lg" />
          Play
        </a>
        <a class="btn-outline btn" href="/{animes[animeIdx].id}"> Details </a>
      </div>
    </div>
  </div>
</header>
