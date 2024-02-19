<script lang="ts">
  import { page } from '$app/stores';
  import type { Anime, Episode } from '$lib/model/classes/Anime';
  import { createEpisodeContextMenu } from '$lib/model/contextmenu';
  import { downloading, downloads } from '$lib/model/downloads';
  import { settings } from '$lib/model/settings';
  import { unwatchedSubscriptions } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';
  import {
    faDownload,
    faFileCircleCheck
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';
  import { showMenu } from 'tauri-plugin-context-menu';
  import EpisodeContextMenu from './EpisodeContextMenu.svelte';

  export let anime: Pick<Anime, 'id' | 'title' | 'source'> & Partial<Anime>;
  export let episode: Episode;
  export let replaceState = false;
  export let href = `/${anime.source.id}/${anime.id}/${episode.id}`;

  $: id = `${anime.source.id}/${anime.id}`;
  $: epId = `${id}/${episode.id}`;

  $: watchedObject = $watching[id]?.watchedEpisodes[episode.id];

  $: isNewEpisode =
    $unwatchedSubscriptions?.[id]?.newEpisodes.has(episode.id) ?? false;

  let downloadState: 'idle' | 'downloading' | 'downloaded' = 'idle';

  $: if ($downloading[epId] && !$downloads[id]?.episodes?.[episode.id]) {
    downloadState = 'downloading';
  }
  $: if ($downloads[id]?.episodes?.[episode.id] && !$downloading[epId]) {
    downloadState = 'downloaded';
  }
  $: if (!$downloads[id]?.episodes?.[episode.id] && !$downloading[epId]) {
    downloadState = 'idle';
  }

  $: progress = $downloading[epId]?.progress;

  async function download() {
    switch (downloadState) {
      case 'idle':
        downloading.add(episode.id, anime, '1080p', episode.number);
        break;
      case 'downloading':
        downloading.cancel(`${anime.source.id}/${anime.id}/${episode.id}`);
        break;
      case 'downloaded':
        downloads.remove(anime, episode.id);
        break;
      default:
        break;
    }
  }

  let imageLoaded = true;
  let skeleton = true;

  let image: HTMLElement;
  let background: HTMLElement;

  function contextMenu() {
    if (window.__TAURI__) {
      showMenu({
        items: createEpisodeContextMenu(
          anime as Anime,
          episode,
          $page.route.id?.startsWith('/library') ?? false,
          !!$page.params.episode
        )
      });
    }
  }
</script>

<a
  in:fade|global
  {href}
  id={episode.id}
  bind:this={background}
  style:--anime-color={anime.color ?? 'oklch(var(--a))'}
  class="group-one indicator flex w-[168px] select-none flex-col gap-2 focus-visible:outline-transparent lg:w-[210px]"
  class:w-[210px]={!$settings.showThumbnail}
  data-sveltekit-replacestate={replaceState ? '' : 'off'}
  on:contextmenu|stopPropagation|preventDefault={contextMenu}
>
  {#if $settings.showThumbnail}
    <div
      class="card indicator relative m-0 h-[94px] w-[168px] rounded-md bg-base-300 p-0 ring ring-transparent ring-offset-2 ring-offset-transparent transition-all duration-200 hover:-translate3d-y-1 group-one-focus-visible:ring-[--anime-color] group-one-focus-visible:ring-offset-base-200 lg:h-[118px] lg:w-[210px]"
      class:w-[210px]={!$settings.showThumbnail}
    >
      <img
        src={imageLoaded ? episode.image : '/assets/loading_failure.jpeg'}
        alt={episode.title ?? `Episode ${episode.number}`}
        on:error|once={() => (imageLoaded = false)}
        on:load|once={() => (skeleton = false)}
        bind:this={image}
        class="card-body relative m-0 aspect-video h-full w-full rounded-md object-cover object-center p-0"
        class:skeleton
      />
      <div class="pointer-events-none relative mx-1">
        <div
          style="width: {(watchedObject?.percentage ?? 0) * 100}%;"
          class="absolute bottom-1 left-0 right-0 h-1 rounded-md bg-[--anime-color] shadow-lg shadow-black"
        />
      </div>
      {#if isNewEpisode}
        <div class="badge indicator-item badge-error" />
      {/if}
    </div>
  {/if}
  <div
    class="relative flex h-full flex-col gap-1"
    class:noImageDesc={!$settings.showThumbnail}
    class:pb-6={watchedObject?.percentage && !$settings.showThumbnail}
  >
    <div class="flex h-full w-full flex-row items-center justify-between gap-1">
      <div
        class="group flex w-full flex-col gap-1 text-base-content
        {(watchedObject?.percentage ?? 0) >= 0.8
          ? 'text-opacity-40'
          : 'text-opacity-80'}
        hover:text-opacity-100 group-one-focus-visible:text-opacity-100"
      >
        <h3
          class="text-md line-clamp-2 overflow-hidden overflow-ellipsis whitespace-normal font-bold leading-tight transition-colors duration-200 group-hover:text-[--anime-color] group-one-focus-visible:text-[--anime-color]"
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
      {#if window?.__TAURI__}
        <button
          class="group-two btn btn-ghost btn-sm aspect-video h-fit"
          class:no-animation={downloadState === 'downloading'}
          on:click|stopPropagation|preventDefault={download}
        >
          {#if downloadState === 'downloading'}
            {#if progress && progress < 1}
              <div
                class="radial-progress text-xs"
                style:--value={progress * 100}
                style:--size="1.8rem"
                style:--thickness="0.2rem"
              >
                {Math.floor(progress * 100)}
              </div>
            {:else}
              <span class="loading loading-ring" />
            {/if}
          {:else if downloadState === 'downloaded'}
            <Fa
              icon={faFileCircleCheck}
              size="1.5x"
              class="text-success text-opacity-40 transition-colors group-two-hover:text-opacity-100 group-two-focus-visible:text-opacity-100"
            />
          {:else}
            <Fa
              icon={faDownload}
              size="1.5x"
              class="text-base-content text-opacity-40 transition-colors group-two-hover:text-opacity-100 group-two-focus-visible:text-opacity-100"
            />
          {/if}
        </button>
      {/if}
    </div>
    {#if !$settings.showThumbnail}
      <div class="pointer-events-none absolute bottom-1 left-0 right-0 mx-1">
        <div
          style="width: {(watchedObject?.percentage ?? 0) * 100}%;"
          class="h-1 rounded-md bg-[--anime-color]"
        />
      </div>
    {/if}
  </div>
  {#if isNewEpisode && !$settings.showThumbnail}
    <div class="badge indicator-item badge-error" />
  {/if}
</a>

{#if !window.__TAURI__}
  <EpisodeContextMenu
    {anime}
    {episode}
    element={$settings.showThumbnail ? image : background}
  />
{/if}

<style>
  .noImageDesc {
    @apply card justify-center rounded-md bg-base-300 p-4 shadow-lg ring ring-transparent ring-offset-2 ring-offset-transparent transition-shadow duration-200;
  }

  .group-one:focus-visible .noImageDesc {
    --tw-ring-color: var(--anime-color);
  }

  .group-one:focus-visible .noImageDesc {
    --tw-ring-offset-color: oklch(var(--b2) / 1);
  }
</style>
