<script lang="ts">
  import { beforeNavigate, invalidate } from '$app/navigation';
  import type { Anime, Episode, EpisodeData } from '$lib/model/classes/Anime';
  import { downloads } from '$lib/model/downloads';
  import { getOS } from '$lib/model/info';
  import { settings } from '$lib/model/settings';
  import { watching } from '$lib/model/watch';
  import Hls from 'hls.js';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type {
    HLSProvider,
    MediaPlayerElement,
    MediaProviderChangeEvent,
    MediaTimeSliderElement,
    MediaVolumeSliderElement
  } from 'vidstack';
  import { defineCustomElements } from 'vidstack/elements';
  import 'vidstack/styles/base.css';
  import 'vidstack/styles/community-skin/video.css';
  import 'vidstack/styles/defaults.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  import PlayerContextMenu from './PlayerContextMenu.svelte';

  export let episodeData: EpisodeData;
  export let poster: string;
  export let anime: Anime;
  export let episode: Episode;
  export let disableRemotePlayback = false;

  let player: MediaPlayerElement | undefined = undefined;

  $: watchedObject =
    $watching[`${anime.source.id}/${anime.id}`]?.watchedEpisodes[episode.id];
  $: state = player?.state;

  const thumbnails = episodeData?.subtitles?.find(
    track => track.lang.toLowerCase() === 'thumbnails'
  );

  const dispatcher = createEventDispatcher();

  function requestNextEpisode() {
    player?.exitFullscreen();
    player?.exitPictureInPicture();
    dispatcher('requestNextEpisode', () => {
      if (
        $settings.deleteOnWatch &&
        state &&
        state.currentTime / state.duration >= 0.8
      )
        downloads.remove(anime, episode.id);
    });
  }

  function keyNext(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'N') {
      event.preventDefault();
      requestNextEpisode();
    }
  }

  function providerChange(event: MediaProviderChangeEvent) {
    const provider = event.detail;
    if (provider && provider.type === 'hls') {
      (provider as HLSProvider).library = Hls;
    }
  }

  onMount(async () => {
    await defineCustomElements();
    player?.onAttach(async () => {
      try {
        const time = player?.querySelector(
          'media-time-slider:first-of-type'
        ) as MediaTimeSliderElement;
        // set custom seek duration
        if (time) {
          time.keyStep = 5;
          time.shiftKeyMultiplier = 3;
        }

        const vol = player?.querySelector(
          'media-volume-slider:first-of-type'
        ) as MediaVolumeSliderElement;
        // set custom volume step
        if (vol) {
          vol.keyStep = 5;
          vol.shiftKeyMultiplier = 3;
        }

        if (window.__TAURI__) {
          const os = await getOS();
          if (os !== 'Darwin' && os !== 'Unknown') {
            player?.addEventListener(
              'fullscreen-change',
              async ({ detail }) => {
                const { appWindow } = await import('@tauri-apps/api/window');
                appWindow?.setFullscreen(detail);
              }
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
      player?.focus();
    });

    player?.addEventListener(
      'loaded-data',
      () => {
        if (player) {
          const time = watchedObject?.time ?? 0;
          player.currentTime =
            time < (player.state.duration || anime.duration) ? time : 0;
        }
      },
      {
        once: true
      }
    );

    console.debug(anime, episodeData, episode);
  });

  function updateWatched() {
    const state = player?.state;
    if (state) {
      watching.watch(anime, {
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
    if (player) player.destroy();
  });

  beforeNavigate(updateWatched);
</script>

<svelte:window on:keydown={keyNext} />

<svelte:head>
  <meta name="referrer" content="no-referrer" />
</svelte:head>

{#if episodeData.sources}
  <div class="relative -m-4 mb-4 h-auto w-screen bg-black">
    <media-player
      {poster}
      title={episode.title ?? `Episode ${episode.number}`}
      aspect-ratio="16/9"
      style:--video-brand={anime.color ?? 'hsl(var(--a))'}
      class="mx-auto flex aspect-video w-screen items-center justify-center border-none object-cover md:w-[max(800px,70vw)]"
      preload="metadata"
      {disableRemotePlayback}
      thumbnails={thumbnails?.url}
      bind:this={player}
      on:provider-change={providerChange}
      on:ended={requestNextEpisode}
      on:pause={updateWatched}
      on:error={() => invalidate(`${anime.source}/${anime.id}/${episode.id}`)}
      on:hls-error={() =>
        invalidate(`${anime.source}/${anime.id}/${episode.id}`)}
    >
      <media-poster alt={episode.description} />
      <media-outlet>
        {#each episodeData.sources as source}
          <source
            src={source.url}
            type={source.type ||
              (source.isM3U8 ? 'application/x-mpegURL' : 'video/mp4')}
          />
        {/each}
        {#each episodeData.subtitles ?? [] as track}
          <track
            label={track.lang}
            kind="captions"
            src={track.url}
            default={track.lang.toLowerCase() === 'english'}
          />
        {/each}
      </media-outlet>
      <media-community-skin />
      <PlayerContextMenu
        {anime}
        {episode}
        element={player}
        {requestNextEpisode}
      />
    </media-player>
  </div>
{:else}
  <div class="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
    <p
      class="text-center text-xl font-semibold text-base-content text-opacity-70"
    >
      No Video Urls Found
    </p>
    <button class="btn-link" on:click={() => window.history.back()}>
      Go Back
    </button>
  </div>
{/if}
