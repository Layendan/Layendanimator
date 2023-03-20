<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Anime, Episode } from '$lib/model/Anime';
  import { watched } from '$lib/model/watch';

  export let anime: Anime;
  export let episode: Episode;
  export let showImage = true;
  export let replaceState = false;
</script>

<a
  transition:fade|local
  href="/{anime.id}/{episode.id}"
  class="group-one flex w-[210px] flex-col gap-2 focus-visible:outline-transparent"
  data-sveltekit-replacestate={replaceState ? true : undefined}
>
  {#if showImage}
    <div
      class="card relative m-0 aspect-video h-auto w-[210px] rounded-md bg-base-300 bg-clip-content p-0 shadow-lg transition-transform duration-200 hover:-translate3d-y-1 group-one-focus-visible:-translate-y-1"
    >
      <img
        src={episode.image ?? 'loading_failure.jpeg'}
        alt={episode.title ?? `Episode ${episode.number}`}
        class="card-body relative m-0 aspect-video h-full w-full rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-center bg-no-repeat object-cover object-center p-0"
      />
      <div style:--anime-color={anime.color} class="relative mx-1 select-none">
        <div
          style="width: {($watched[anime.id]?.find(
            item => item.episode.id === episode.id
          )?.percentage ?? 0) * 100}%;"
          class="absolute bottom-1 left-0 right-0 h-1 rounded-md shadow-lg
          {anime.color ? 'bg-[var(--anime-color)]' : 'bg-accent'}"
        />
      </div>
    </div>
  {/if}
  <!-- TODO: Check if no image is shown and if user has already watched -->
  <div
    class="group flex h-full flex-col gap-1 text-base-content text-opacity-80 hover:text-opacity-100 group-one-focus-visible:text-opacity-100"
    class:noImageDesc={!showImage}
  >
    <h3
      style:--anime-color={anime.color}
      class="text-md whitespace-normal font-bold leading-tight text-base-content text-opacity-80 transition-colors duration-200 line-clamp-2
      {anime.color
        ? 'group-hover:text-[var(--anime-color)] group-one-focus-visible:text-[var(--anime-color)]'
        : 'group-hover:text-accent group-one-focus-visible:text-accent'}"
    >
      {episode.title || `Episode ${episode.number}`}
    </h3>
    {#if episode.title && episode.number}
      <h2
        class="whitespace-normal text-xs leading-none transition-colors duration-200"
      >
        Episode {episode.number}
      </h2>
    {/if}
  </div>
</a>

<style>
  .noImageDesc {
    @apply card justify-center rounded-md bg-base-300 p-4 shadow-lg;
  }
</style>
