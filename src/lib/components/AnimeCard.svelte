<script lang="ts">
  import type { Anime } from '$lib/model/Anime';
  import { fade } from 'svelte/transition';

  export let anime: Anime;

  export let numUpdates = 0;
</script>

<a in:fade href="/{anime.id}" class="indicator w-[210px] flex-col gap-2">
  {#if numUpdates > 0}
    <div class="badge-primary badge indicator-item">
      {numUpdates}
    </div>
  {/if}
  <div
    class="card relative m-0 aspect-[0.7/1] h-[300px] w-[210px] bg-base-300 bg-clip-content p-0  transition-transform duration-200 hover:-translate3d-y-1"
  >
    <img
      class="card-body relative m-0 h-full w-full rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-center bg-no-repeat object-cover object-center p-0"
      src={anime.image ?? '/assets/loading_failure.jpeg'}
      alt={anime.title.english ?? anime.title.romaji}
    />
    {#if anime.episodeNumber}
      <div
        class="card-body pointer-events-none absolute bottom-3 left-0 right-0 m-0 mx-3 flex h-8 w-auto items-center justify-center rounded-lg bg-base-300 bg-opacity-60 p-0 backdrop-blur-xl"
      >
        <!-- text-accent-content only works on light/dark color schemes otherwise dark theme text color is too light and is not readable -->
        <h2
          class="card-title text-center text-sm font-bold text-accent-content"
        >
          Episode {anime.episodeNumber}
        </h2>
      </div>
    {/if}
  </div>

  <div>
    <h3
      style:--anime-color={anime.color}
      class={`whitespace-normal text-sm font-bold leading-tight text-base-content text-opacity-80 transition-colors duration-200 line-clamp-2 hover:text-opacity-100
      ${anime.color ? 'hover:text-[var(--anime-color)]' : 'hover:text-accent'}`}
    >
      {anime.title.english ?? anime.title.romaji}
    </h3>
  </div>
</a>
