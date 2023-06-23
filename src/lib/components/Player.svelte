<script lang="ts">
  import 'vidstack/styles/base.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  import 'vidstack/styles/defaults.css';
  import 'vidstack/styles/community-skin/video.css';
  import { defineCustomElements } from 'vidstack/elements';
  import type { HLSProvider, MediaPlayerElement } from 'vidstack';

  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import { watching } from '$lib/model/watch';
  import type { Anime, Episode, EpisodeData } from '$lib/model/classes/Anime';
  import { getOS } from '$lib/model/info';
  import { beforeNavigate } from '$app/navigation';
  import Hls from 'hls.js';
  import { downloads } from '$lib/model/downloads';
  import { settings } from '$lib/model/settings';

  export let episodeData: EpisodeData;
  export let poster: string;
  export let anime: Anime;
  export let episode: Episode;
  export let disableRemotePlayback = false;

  let player: MediaPlayerElement | undefined = undefined;

  $: watchedObject = $watching[anime.id]?.watchedEpisodes[episode.id];

  const dispatcher = createEventDispatcher();

  function requestNextEpisode() {
    const state = player?.state;
    dispatcher('requestNextEpisode', () => {
      if (
        $settings.deleteOnWatch &&
        state &&
        state.currentTime / state.duration >= 0.8
      )
        downloads.remove(anime.id, episode.id);
    });
  }

  function keyNext(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'N') {
      event.preventDefault();
      requestNextEpisode();
    }
  }

  onMount(async () => {
    await defineCustomElements();
    player?.addEventListener('provider-change', event => {
      const provider = event.detail;
      if (provider && provider.type === 'hls') {
        (provider as HLSProvider).library = Hls;
      }
    });
    player?.onAttach(async () => {
      try {
        const os = await getOS();
        if (os !== 'Darwin' && os !== 'Unknown') {
          player?.addEventListener('fullscreen-change', async ({ detail }) => {
            const { appWindow } = await import('@tauri-apps/api/window');
            appWindow?.setFullscreen(detail);
          });
        }
      } catch (e) {
        console.error(e);
      }
      if (player) {
        player.currentTime =
          (watchedObject?.time ?? 0) < (player.state.duration || anime.duration)
            ? watchedObject?.time ?? 0
            : 0;
        player.enterFullscreen();
        player.focus();
      }
    });
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
    player?.destroy();
  });

  beforeNavigate(updateWatched);
</script>

<svelte:window on:keydown={keyNext} />

<div class="relative -m-4 mb-4 h-auto w-screen bg-black">
  <media-player
    {poster}
    title={episode.title}
    aspect-ratio="16/9"
    style:--video-brand={anime.color ?? 'hsl(var(--a))'}
    class="mx-auto flex aspect-video w-screen items-center justify-center border-none object-cover md:w-[max(800px,70vw)]"
    preload="metadata"
    autoplay
    {disableRemotePlayback}
    bind:this={player}
    on:ended={requestNextEpisode}
    on:pause={updateWatched}
    on:autoplay|once={() => {
      if (player) {
        const time = watchedObject?.time ?? 0;
        player.currentTime =
          time < (player.state.duration || anime.duration) ? time : 0;
      }
    }}
  >
    <media-poster alt={episode.description} />
    <media-outlet>
      {#each episodeData.sources as source}
        <source src={source.url} />
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
  </media-player>
</div>
