<script lang="ts">
  import type { Anime } from '$lib/model/Anime';
  import { fade } from 'svelte/transition';

  // TODO: Create anime type and set it to this
  export let anime: Anime;

  export let numUpdates = 0;
</script>

<div in:fade class="indicator flex-col gap-2 w-[210px]">
  {#if numUpdates > 0}
    <div class="indicator-item badge badge-primary">
      {numUpdates}
    </div>
  {/if}
  <a
    class="relative bg-clip-content rounded-md m-0 p-0 card w-[210px] h-auto aspect-[0.7/1] bg-base-300 shadow-lg hover:translate-y-[-4px] transition-transform duration-300"
    href="/{anime.id}"
  >
    <img
      class="relative card-body m-0 p-0 w-full h-full object-cover object-center rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-no-repeat bg-center"
      src={anime.image ?? '/assets/loading_failure.jpeg'}
      alt={anime.title.english ?? anime.title.romaji}
    />
    {#if anime.episodeNumber}
      <div
        class="card-body rounded-lg m-0 p-0 absolute bg-base-300 bg-clip-border backdrop-blur-xl bg-opacity-60 h-8 w-auto mx-3 bottom-3 left-0 right-0 flex items-center justify-center pointer-events-none"
      >
        <!-- text-accent-content only works on light/dark color schemes otherwise dark theme text color is too light and is not readable -->
        <h2
          class="card-title text-center font-bold text-sm text-accent-content"
        >
          Episode {anime.episodeNumber}
        </h2>
      </div>
    {/if}
  </a>

  <a href="/{anime.id}">
    <h3
      style:--anime-color={anime.color}
      class="text-sm font-bold leading-tight whitespace-normal hover:text-accent line-clamp-2 accent hover:text-opacity-80 transition-colors duration-300"
      class:hover:text-[var(--anime-color)]={anime.color}
    >
      {anime.title.english ?? anime.title.romaji}
    </h3>
  </a>
</div>
