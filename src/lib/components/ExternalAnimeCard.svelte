<script lang="ts">
  import { page } from '$app/stores';
  import type { Anime } from '$lib/model/classes/Anime';
  import { createAnimeCardContextMenu } from '$lib/model/contextmenu';
  import { encodeAnimeLink } from '$lib/model/source';
  import { showMenu } from 'tauri-plugin-context-menu';
  import AnimeContextMenu from './AnimeContextMenu.svelte';

  export let anime: Anime;

  let imageLoaded = true;
  let skeleton = true;
  let element: HTMLImageElement;

  $: if (anime.image) {
    imageLoaded = true;
    skeleton = true;
  }

  function contextMenu() {
    if (window.__TAURI__) {
      showMenu({
        items: createAnimeCardContextMenu(
          anime as Anime,
          $page.route.id?.startsWith('/library') ?? false
        )
      });
    }
  }
</script>

<a
  href={encodeAnimeLink(anime)}
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group"
  on:contextmenu|stopPropagation|preventDefault={contextMenu}
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

{#if !window.__TAURI__}
  <AnimeContextMenu {anime} {element} />
{/if}
