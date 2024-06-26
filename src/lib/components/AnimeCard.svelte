<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { createAnimeCardContextMenu } from '$lib/model/contextmenu';
  import { settings } from '$lib/model/settings';
  import { providers } from '$lib/model/source';
  import { fade } from 'svelte/transition';
  import { showMenu } from 'tauri-plugin-context-menu';
  import AnimeContextMenu from './AnimeContextMenu.svelte';

  export let anime: Pick<
    Anime,
    'id' | 'title' | 'image' | 'source' | 'trailer'
  > &
    Partial<Anime>;
  export let numUpdates = 0;
  export let extra = '';
  export let href = `/${anime.source.id}/${anime.id}`;
  export let isDownload = false;
  export let showSource = false;

  const sourceImg = $providers[anime.source.id]?.logo;

  let imageLoaded = true;
  let skeleton = true;

  let element: HTMLElement;

  function contextMenu() {
    if (window.__TAURI__) {
      showMenu({
        items: createAnimeCardContextMenu(anime as Anime, isDownload)
      });
    }
  }
</script>

{#if anime.id}
  <a
    in:fade|global
    {href}
    id={anime.id}
    style:--anime-color={anime.color ?? 'oklch(var(--a))'}
    class="group indicator flex w-[168px] flex-col gap-2 focus-visible:outline-transparent lg:w-[210px]"
    aria-label={anime.title.english ?? anime.title.romaji}
    on:contextmenu|stopPropagation|preventDefault={contextMenu}
  >
    <div
      class="group-one card relative m-0 aspect-[0.7/1] h-[240px] w-[168px] rounded-md bg-base-300 p-0 ring ring-transparent ring-offset-2 ring-offset-transparent transition-all duration-200 hover:-translate3d-y-1 group-focus-visible:ring-[--anime-color] group-focus-visible:ring-offset-base-200 lg:h-[300px] lg:w-[210px]"
    >
      {#if numUpdates > 0}
        <div class="badge indicator-item badge-error 2xl:font-bold">
          {numUpdates}
        </div>
      {/if}
      {#key anime.image}
        <img
          src={imageLoaded ? anime.image : '/assets/loading_failure.jpeg'}
          alt={anime.title.english ?? anime.title.romaji}
          bind:this={element}
          on:error|once={() => (imageLoaded = false)}
          on:load|once={() => (skeleton = false)}
          class="card-body relative m-0 h-full w-full rounded-md bg-base-300 bg-cover bg-center bg-no-repeat object-cover object-center p-0"
          class:skeleton
        />
        {#if showSource && $settings.showSourcesOnAnime && sourceImg}
          <img
            src={sourceImg}
            alt={anime.source.name}
            class="absolute left-2 top-2 h-6 w-6 rounded-md bg-base-300 bg-opacity-60 p-0 backdrop-blur-xl lg:h-8 lg:w-8"
          />
        {/if}
      {/key}
      {#if !!extra}
        <div
          class="card-body pointer-events-none absolute bottom-3 left-0 right-0 m-0 mx-3 flex h-8 w-auto items-center justify-center overflow-hidden rounded-lg bg-base-300 bg-opacity-60 p-0 backdrop-blur-xl"
        >
          <h2
            class="card-title text-center text-sm font-bold capitalize text-base-content mix-blend-luminosity"
          >
            {extra.toLocaleLowerCase()}
          </h2>
        </div>
      {/if}
    </div>

    <h3
      class="line-clamp-2 w-fit whitespace-normal text-sm font-bold leading-tight text-base-content text-opacity-80 transition-colors duration-200 hover:text-[--anime-color] hover:text-opacity-100 group-focus-visible:text-[--anime-color] group-focus-visible:text-opacity-100 2xl:text-base"
    >
      {anime.title.english ?? anime.title.romaji}
    </h3>
  </a>

  {#if !window.__TAURI__}
    <AnimeContextMenu {anime} {element} {isDownload} />
  {/if}
{/if}
