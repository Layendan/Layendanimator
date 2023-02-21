<script lang="ts">
  import type { Anime } from '$lib/model/Anime';
  import { fade } from 'svelte/transition';

  // TODO: Create anime type and set it to this
  export let anime: Anime;

  export let numUpdates = 0;
</script>

<a in:fade href="/{anime.id}" class="indicator flex-col gap-2 w-[210px]">
  {#if numUpdates > 0}
    <div class="indicator-item badge badge-primary">
      {numUpdates}
    </div>
  {/if}
  <div
    class="relative bg-clip-content rounded-md m-0 p-0 card w-[210px] h-auto aspect-[0.7/1] bg-base-300  hover:-translate-y-1 transition-transform duration-200"
  >
    <img
      class="relative card-body m-0 p-0 w-full h-full object-cover object-center rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-no-repeat bg-center"
      src={anime.image ?? '/assets/loading_failure.jpeg'}
      alt={anime.title.english ?? anime.title.romaji}
    />
    {#if anime.episodeNumber}
      <div
        class="card-body rounded-lg m-0 p-0 absolute bg-base-300  h-8 w-auto mx-3 bottom-3 left-0 right-0 flex items-center justify-center pointer-events-none"
      >
        <!-- text-accent-content only works on light/dark color schemes otherwise dark theme text color is too light and is not readable -->
        <h2
          class="card-title text-center font-bold text-sm text-accent-content"
        >
          Episode {anime.episodeNumber}
        </h2>
      </div>
    {/if}
  </div>

  <div>
    <h3
      style:--anime-color={anime.color}
      class="text-sm font-bold leading-tight whitespace-normal text-base-content text-opacity-80 hover:text-opacity-100 line-clamp-2 transition-colors duration-200"
    >
      {anime.title.english ?? anime.title.romaji}
    </h3>
  </div>
</a>
