<script lang="ts">
  import { beforeNavigate, invalidate } from '$app/navigation';
  import type { Anime, Episode, EpisodeData } from '$lib/model/classes/Anime';
  import { downloads } from '$lib/model/downloads';
  import { getOS } from '$lib/model/info';
  import { settings } from '$lib/model/settings';
  import { watching } from '$lib/model/watch';
  import Hls from 'hls.js';
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { HLSProvider, MediaProviderChangeEvent } from 'vidstack';
  import type {
    MediaPlayerElement,
    MediaTimeSliderElement,
    MediaVolumeSliderElement
  } from 'vidstack/elements';
  // Import styles.
  import { createPlayerContextMenu } from '$lib/model/contextmenu';
  import { encodeAnimeLink } from '$lib/model/source';
  import { showMenu } from 'tauri-plugin-context-menu';
  import PlayerContextMenu from './PlayerContextMenu.svelte';
  // Import styles.
  import 'vidstack/player/styles/default/theme.css';
  import 'vidstack/player/styles/default/layouts/video.css';
  // Register elements.
  import 'vidstack/player';
  import 'vidstack/player/layouts';
  import 'vidstack/player/ui';

  export let episodeData: EpisodeData;
  export let poster: string;
  export let anime: Pick<
    Anime,
    'source' | 'id' | 'title' | 'image' | 'color' | 'duration'
  >;
  export let episode: Episode;

  let player: MediaPlayerElement;
  let airPlayEnabled = false;

  $: watchedObject =
    $watching[`${anime.source.id}/${anime.id}`]?.watchedEpisodes[episode.id];

  $: $settings.preferNativeHls
    ? player?.setAttribute('prefer-native-hls', '')
    : player?.removeAttribute('prefer-native-hls');

  const thumbnails = episodeData?.subtitles?.find(
    track => track.lang.toLowerCase() === 'thumbnails'
  );

  let defaultSource = episodeData?.sources?.find(
    source =>
      source.quality?.toLowerCase() === 'download' ||
      source.quality?.toLowerCase() === 'default' ||
      source.quality?.toLowerCase() === 'auto'
  );

  $: if (episodeData.sources) {
    if (player) {
      updateWatched();
      const paused = player.paused;
      if (
        player?.state?.isAirPlayConnected ||
        player?.state?.isGoogleCastConnected
      ) {
        defaultSource = episodeData.sources.find(
          source =>
            source.quality?.toLowerCase() === 'default' ||
            source.quality?.toLowerCase() === 'auto'
        );
      } else {
        defaultSource = episodeData.sources.find(
          source =>
            source.quality?.toLowerCase() === 'download' ||
            source.quality?.toLowerCase() === 'default' ||
            source.quality?.toLowerCase() === 'auto'
        );
      }
      const time = watchedObject?.time ?? 0;
      player.currentTime =
        time < (player.state.duration || (anime.duration ?? Infinity))
          ? time
          : 0;
      if (paused) player.pause();
    }
  }

  const dispatcher = createEventDispatcher();

  function requestNextEpisode() {
    if (player.state.loop) return;
    player?.exitFullscreen();
    player?.exitPictureInPicture();
    const state = player?.state;
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

  function setStepsAndSession() {
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

    // Set MediaSession metadata
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.title ?? `Episode ${episode.number}`,
        artist: anime.title.english ?? anime.title.romaji ?? 'Unknown',
        album: `Episode ${episode.number}`,
        artwork: [{ src: episode.image ?? anime.image }]
      });

      if (!player) return;

      navigator.mediaSession.setActionHandler('play', () => {
        player.play();
        navigator.mediaSession.playbackState = 'playing';
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        player.pause();
        navigator.mediaSession.playbackState = 'paused';
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        requestNextEpisode();
      });
    }
  }

  console.log(episodeData);

  onMount(async () => {
    setStepsAndSession();

    player?.addEventListener('playing', setStepsAndSession, {
      once: true
    });

    try {
      if (window.__TAURI__) {
        const [os, { appWindow }] = await Promise.all([
          getOS(),
          import('@tauri-apps/api/window')
        ]);

        if (os !== 'Darwin' && os !== 'Unknown') {
          player?.addEventListener('fullscreen-change', async ({ detail }) => {
            const { appWindow } = await import('@tauri-apps/api/window');
            appWindow?.setFullscreen(detail);
          });
        }

        player?.addEventListener('picture-in-picture-change', ({ detail }) => {
          if (detail || player.paused) return;
          appWindow.setFocus();
        });
      }
    } catch (e) {
      console.error(e);
    }
    player?.focus();

    player?.addEventListener(
      'loaded-data',
      () => {
        if (player) {
          const time = watchedObject?.time ?? 0;
          player.currentTime =
            time < (player.state.duration || (anime.duration ?? Infinity))
              ? time
              : 0;
        }
      },
      {
        once: true
      }
    );

    if (player) {
      player.volume = $settings.playerVolume;
      player.muted = $settings.playerMuted;
    }

    console.debug(anime, episodeData, episode);
  });

  async function updateWatched() {
    const state = player?.state;
    if (state) {
      watching.watch(anime as Anime, {
        episode,
        time: state.currentTime || (watchedObject?.time ?? 0),
        percentage: Math.min(
          state.currentTime / (state.duration || anime.duration || Infinity),
          1
        )
      });

      $settings.playerVolume = state.volume;
      $settings.playerMuted = state.muted;

      if (window.__TAURI__ && $settings.discordRPC === 'enabled') {
        const { invoke } = await import('@tauri-apps/api/tauri');
        const { playing, currentTime, duration } = state;
        console.log(playing, currentTime, duration);
        if (playing && typeof currentTime === 'number' && duration) {
          invoke('set_watching', {
            title: anime.title.english ?? anime.title.romaji ?? 'Unknown',
            episode: episode.number,
            episodeTitle: episode.title,
            artwork: anime.image,
            link: encodeAnimeLink(anime),
            currentTime,
            duration
          });
        } else {
          invoke('pause_watching', {
            title: anime.title.english ?? anime.title.romaji ?? 'Unknown',
            artwork: anime.image,
            link: encodeAnimeLink(anime)
          });
        }
      }
    }
  }

  const interval = setInterval(updateWatched, 30_000);

  onDestroy(async () => {
    clearInterval(interval);
    console.log(player.state.volume);
    if (player.state.volume) $settings.playerVolume = player.state.volume;
    if (player.state.muted) $settings.playerMuted = player.state.muted;
    if (player) {
      player.exitFullscreen();
      player.exitPictureInPicture();
      player.destroy();
    }
    if (window.__TAURI__ && $settings.discordRPC === 'enabled') {
      const { invoke } = await import('@tauri-apps/api/tauri');
      invoke('reset_activity');
    }
  });

  beforeNavigate(updateWatched);

  async function contextMenu() {
    if (window.__TAURI__) {
      showMenu({
        items: await createPlayerContextMenu(
          anime as Anime,
          episode,
          player,
          airPlayEnabled,
          requestNextEpisode
        )
      });
    }
  }
</script>

<svelte:window on:keydown={keyNext} />

<svelte:head>
  <meta name="referrer" content="no-referrer" />
</svelte:head>

{#if episodeData.sources}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <media-player
    title={episode.title ?? `Episode ${episode.number}`}
    style:--video-brand={anime.color ?? 'oklch(var(--a))'}
    style:--video-border-radius="0px"
    class="relative mb-4 flex aspect-video h-auto w-full items-center justify-center overflow-hidden border-none bg-black object-cover"
    preload="metadata"
    autoplay
    streamType="on-demand"
    preferNativeHLS={$settings.preferNativeHls}
    load="eager"
    viewType="video"
    bind:this={player}
    on:provider-change={providerChange}
    on:ended={requestNextEpisode}
    on:pause={updateWatched}
    on:playing={updateWatched}
    on:error={() => invalidate(`${anime.source}:${anime.id}:${episode.id}`)}
    on:hls-error={() => invalidate(`${anime.source}:${anime.id}:${episode.id}`)}
    on:contextmenu|stopPropagation|preventDefault={contextMenu}
  >
    <media-provider>
      {#if defaultSource}
        <source
          src={defaultSource.url}
          type={defaultSource.type ||
            (defaultSource.isM3U8 ? 'application/x-mpegURL' : 'video/mp4')}
        />
      {/if}
      {#each episodeData.sources as source}
        <source
          src={source.url}
          type={source.type ||
            (source.isM3U8 ? 'application/x-mpegURL' : 'video/mp4')}
        />
      {/each}
      {#each (episodeData.subtitles ?? []).filter(track => track.lang?.toLowerCase() !== 'thumbnails') as track, i}
        <track
          label={track.lang}
          kind="subtitles"
          src={track.url}
          default={i === 0}
        />
      {/each}
      <media-poster class="vds-poster" src={poster} />
    </media-provider>
    <media-video-layout thumbnails={thumbnails?.url} />

    {#if !window.__TAURI__}
      <PlayerContextMenu
        {anime}
        {episode}
        element={player}
        {requestNextEpisode}
      />
    {/if}
  </media-player>
{:else}
  <div class="flex h-full flex-col items-center justify-center">
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
