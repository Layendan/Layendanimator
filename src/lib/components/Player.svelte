<script lang="ts">
  import 'vidstack/styles/base.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  import 'vidstack/define/media-player.js';
  import { defineCustomElements } from 'vidstack/elements';
  import type { HLSProvider, MediaPlayerElement } from 'vidstack';

  import Fa from 'svelte-fa';
  import { faMicrochip, faDownload } from '@fortawesome/free-solid-svg-icons';
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import { watched } from '$lib/model/watch';
  import type { Anime, Episode, EpisodeData } from '$lib/model/classes/Anime';
  import { getOS } from '$lib/model/info';
  import { beforeNavigate } from '$app/navigation';
  import Hls from 'hls.js';
  import { downloading, downloads } from '$lib/model/downloads';
  import { settings } from '$lib/model/settings';

  export let episodeData: EpisodeData;
  export let poster: string;
  export let anime: Anime;
  export let episode: Episode;
  export let disableRemotePlayback = false;

  let player: MediaPlayerElement | undefined = undefined;

  $: watchedObject = $watched[anime.id]?.find(
    item => item.episode.number === episode.number
  );

  const defaultIndex = episodeData.sources.findIndex(
    source => source.quality === 'default'
  );
  let selectedSource = defaultIndex !== -1 ? defaultIndex : 0;

  const dispatcher = createEventDispatcher();

  function requestNextEpisode() {
    const state = player?.state;
    if (
      $settings.deleteOnWatch &&
      state &&
      state.currentTime / state.duration >= 0.8
    ) {
      downloads.remove(anime.id, episode.id);
    }
    dispatcher('requestNextEpisode');
  }

  onMount(async () => {
    await defineCustomElements();
    player?.addEventListener('provider-change', event => {
      const provider = event.detail;
      if (provider && provider.type === 'hls') {
        (provider as HLSProvider).library = Hls;
      }
    });
    player?.onAttach(() => {
      if (player) {
        player.currentTime =
          (watchedObject?.time ?? 0) < (player.state.duration || anime.duration)
            ? watchedObject?.time ?? 0
            : 0;
      }
    });
    const os = await getOS();
    if (os !== 'Darwin' && os !== 'Unknown') {
      player?.addEventListener('fullscreen-change', async event => {
        const { appWindow } = await import('@tauri-apps/api/window');
        const isFullscreen = event.detail;
        appWindow?.setFullscreen(isFullscreen);
      });
    }
  });

  function updateWatched() {
    const state = document.querySelector('media-player')?.state;
    if (state) {
      watched.add(anime.id, {
        episode,
        time: state.currentTime || (watchedObject?.time ?? 0),
        percentage: Math.min(
          state.currentTime / (state.duration || anime.duration || Infinity),
          1
        )
      });
    }
  }

  const interval = setInterval(updateWatched, 15_000);

  onDestroy(() => {
    clearInterval(interval);
    player?.destroy();
  });

  beforeNavigate(updateWatched);
</script>

<div class="relative -m-4 mb-4 h-auto w-screen bg-black">
  <!-- svelte-ignore a11y-autofocus -->
  <media-player
    src={episodeData.sources[selectedSource].url}
    {poster}
    controls
    aspect-ratio="16/9"
    class="mx-auto flex w-screen items-center justify-center object-cover fullscreen:h-screen md:w-[max(800px,70vw)]"
    preload="metadata"
    prefer-native-hls
    {disableRemotePlayback}
    bind:this={player}
    on:ended={requestNextEpisode}
    on:play|once={() => {
      if (player) {
        player.currentTime =
          (watchedObject?.time ?? 0) < (player.state.duration || anime.duration)
            ? watchedObject?.time ?? 0
            : 0;
      }
    }}
  >
    <media-outlet>
      {#each episodeData.subtitles ?? [] as track}
        <track label={track.lang} kind="captions" src={track.url} />
      {/each}
    </media-outlet>
  </media-player>
  <div class="absolute bottom-4 left-4">
    <div class="dropdown-right dropdown-end dropdown">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn-ghost btn">
        <Fa icon={faMicrochip} size="1.5x" />
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content rounded-box z-10 ml-2 w-52 bg-base-200 p-2 shadow"
      >
        {#each episodeData.sources as source, i}
          <li class="m-1">
            <button
              tabindex="0"
              class="btn-accent btn-outline btn w-full items-center"
              disabled={selectedSource === i}
              on:click={() => (selectedSource = i)}
            >
              {source.quality}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  {#if !$downloading[episode.id] && !$downloads[anime.id]?.episodes?.[episode.id]}
    <!-- ffmpeg -i "link" -bsf:a aac_adtstoasc -vcodec copy -c copy -crf 50 "output" -->
    <button
      class="btn-ghost btn absolute bottom-4 right-4"
      on:click={() =>
        downloading.add(
          episode.id,
          anime,
          episodeData.sources[selectedSource].quality,
          episode.number
        )}
    >
      <Fa icon={faDownload} size="1.5x" />
    </button>
  {/if}
</div>
