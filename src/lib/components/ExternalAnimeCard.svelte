<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { encodeAnimeLink } from '$lib/model/source';
  import AnimeContextMenu from './AnimeContextMenu.svelte';

  export let anime: Anime;

  let imageLoaded = true;
  let skeleton = true;
  let element: HTMLImageElement;

  $: if (anime.image) {
    imageLoaded = true;
    skeleton = true;
  }
</script>

<a
  href={encodeAnimeLink(anime)}
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group"
>
  <img
    src={imageLoaded ? anime.image : '/assets/loading_failure.jpeg'}
    alt={anime.title.english ?? anime.title.romaji}
    on:error={() => (imageLoaded = false)}
    on:load={() => (skeleton = false)}
    style:--anime-color={anime.color}
    class="w-full rounded-lg bg-base-200 object-cover shadow-xl ring ring-transparent transition-shadow duration-200
              {anime.color
      ? 'hover:ring-[--anime-color] group-focus-visible:ring-[--anime-color]'
      : 'hover:ring-accent group-focus-visible:ring-accent'}"
    class:skeleton
    bind:this={element}
  />
</a>

<AnimeContextMenu {anime} {element} />
