<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Anime, Episode } from '$lib/model/classes/Anime';
  import { watching } from '$lib/model/watch';
  import { unwatchedSubscriptions } from '$lib/model/subscriptions';
  import Fa from 'svelte-fa';
  import {
    faCheck,
    faDownload,
    faSpinner
  } from '@fortawesome/free-solid-svg-icons';
  import { downloads, downloading } from '$lib/model/downloads';

  export let anime: Anime;
  export let episode: Episode;
  export let showImage = true;
  export let replaceState = false;
  export let type: 'sub' | 'dub' = 'sub';
  export let href = `/${anime.id}/${episode.id}?dub=${type === 'dub'}`;

  $: watchedObject = $watching[anime.id]?.watchedEpisodes[episode.id];

  $: isNewEpisode =
    Math.max(anime.episodes.length - episode.number, 0) <
    ($unwatchedSubscriptions?.[anime.id]?.newEpisodes ?? 0);

  let downloadState: 'idle' | 'downloading' | 'downloaded' = 'idle';

  $: if (
    $downloading[episode.id] &&
    !$downloads[anime.id]?.episodes?.[episode.id]
  ) {
    downloadState = 'downloading';
  }
  $: if (
    $downloads[anime.id]?.episodes?.[episode.id] &&
    !$downloading[episode.id]
  ) {
    downloadState = 'downloaded';
  }
  $: if (
    !$downloads[anime.id]?.episodes?.[episode.id] &&
    !$downloading[episode.id]
  ) {
    downloadState = 'idle';
  }

  async function download() {
    switch (downloadState) {
      case 'idle':
        downloading.add(episode.id, anime, '1080p', episode.number);
        break;
      case 'downloaded':
        downloads.remove(anime.id, episode.id);
        break;
      default:
        break;
    }
  }

  let imageLoaded = true;
</script>

<a
  in:fade|global
  {href}
  id={episode.id}
  style:--anime-color={anime.color ?? 'hsl(var(--a))'}
  class="group-one indicator flex w-[210px] flex-col gap-2 focus-visible:outline-transparent"
  data-sveltekit-replacestate={replaceState ? '' : 'off'}
  on:contextmenu={e => {
    console.debug(e);
  }}
>
  {#if showImage}
    <div
      class="indicator card relative m-0 aspect-video h-auto w-[210px] rounded-md bg-base-300 bg-clip-content p-0 shadow-lg transition-transform duration-200 hover:-translate3d-y-1 group-one-focus-visible:-translate-y-1"
    >
      <img
        src={imageLoaded ? episode.image : '/assets/loading_failure.jpeg'}
        alt={episode.title ?? `Episode ${episode.number}`}
        on:error={() => (imageLoaded = false)}
        class="card-body relative m-0 aspect-video h-full w-full rounded-md bg-base-300 bg-cover bg-center bg-no-repeat object-cover object-center p-0"
      />
      <div class="relative mx-1 select-none">
        <div
          style="width: {(watchedObject?.percentage ?? 0) * 100}%;"
          class="absolute bottom-1 left-0 right-0 h-1 rounded-md bg-[--anime-color] shadow-lg shadow-black"
        />
      </div>
      {#if isNewEpisode}
        <div class="badge badge-error indicator-item" />
      {/if}
    </div>
  {/if}
  <div
    class="relative flex h-full flex-col gap-1"
    class:noImageDesc={!showImage}
    class:pb-6={watchedObject?.percentage && !showImage}
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
          class="text-md line-clamp-2 whitespace-normal font-bold leading-tight transition-colors duration-200 group-hover:text-[--anime-color] group-one-focus-visible:text-[--anime-color]"
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
          class="btn-ghost btn-sm btn"
          class:no-animation={downloadState === 'downloading'}
          on:click|stopPropagation|preventDefault={download}
        >
          {#if downloadState === 'downloading'}
            <Fa
              icon={faSpinner}
              size="1.5x"
              class="animate-spin text-warning"
            />
          {:else if downloadState === 'downloaded'}
            <Fa icon={faCheck} size="1.5x" class="text-success" />
          {:else}
            <Fa icon={faDownload} size="1.5x" />
          {/if}
        </button>
      {/if}
    </div>
    {#if !showImage}
      <div class="absolute bottom-1 left-0 right-0 mx-1 select-none">
        <div
          style="width: {(watchedObject?.percentage ?? 0) * 100}%;"
          class="h-1 rounded-md bg-[--anime-color]"
        />
      </div>
    {/if}
  </div>
  {#if isNewEpisode && !showImage}
    <div class="badge badge-error indicator-item" />
  {/if}
</a>

<style>
  .noImageDesc {
    @apply card justify-center rounded-md bg-base-300 p-4 shadow-lg;
  }
</style>
