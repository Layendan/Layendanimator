<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { watching } from '$lib/model/watch';
  import { faX } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';

  export let anime: Anime;
  export let numUpdates = 0;
  export let deleteable = false;
  export let extra = '';
  export let href = `/${anime.id}`;

  let imageLoaded = true;
</script>

<a
  in:fade
  {href}
  class="group indicator w-[210px] flex-col gap-2 focus-visible:outline-transparent"
>
  <div
    class="group-one card relative m-0 aspect-[0.7/1] h-[300px] w-[210px] bg-base-300 bg-clip-content p-0 transition-transform duration-200 hover:-translate3d-y-1 group-focus-visible:-translate-y-1"
  >
    {#if numUpdates > 0}
      <div class="badge badge-error indicator-item 2xl:font-bold">
        {numUpdates}
      </div>
    {/if}
    {#if deleteable}
      <button
        on:click|stopPropagation|preventDefault={() => watching.remove(anime)}
        class="badge badge-error indicator-item opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-one-hover:opacity-100"
      >
        <Fa icon={faX} size="0.8x" />
      </button>
    {/if}
    <img
      src={imageLoaded ? anime.image : '/assets/loading_failure.jpeg'}
      alt={anime.title.english ?? anime.title.romaji}
      on:error={() => (imageLoaded = false)}
      class="card-body relative m-0 h-full w-full rounded-md bg-base-300 bg-cover bg-center bg-no-repeat object-cover object-center p-0"
    />
    {#if !!extra}
      <div
        class="card-body pointer-events-none absolute bottom-3 left-0 right-0 m-0 mx-3 flex h-8 w-auto items-center justify-center rounded-lg bg-base-300 bg-opacity-60 p-0 backdrop-blur-xl"
      >
        <!-- TODO: text-accent-content only works on light/dark color schemes otherwise dark theme text color is too light and is not readable -->
        <h2
          class="card-title text-center text-sm font-bold capitalize text-accent-content"
        >
          {extra.toLocaleLowerCase()}
        </h2>
      </div>
    {/if}
  </div>

  <h3
    style:--anime-color={anime.color}
    class="line-clamp-2 whitespace-normal text-sm font-bold leading-tight text-base-content text-opacity-80 transition-colors duration-200 hover:text-opacity-100 group-focus-visible:text-opacity-100 2xl:text-base
      {anime.color
      ? 'hover:text-[var(--anime-color)] group-focus-visible:text-[var(--anime-color)]'
      : 'hover:text-accent group-focus-visible:text-accent'}"
  >
    {anime.title.english ?? anime.title.romaji}
  </h3>
</a>
