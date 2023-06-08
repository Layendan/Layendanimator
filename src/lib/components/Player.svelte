<script lang="ts">
  import 'vidstack/styles/base.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  import 'vidstack/styles/defaults.css';
  import 'vidstack/styles/community-skin/video.css';
  import { defineCustomElements } from 'vidstack/elements';
  import type { HLSProvider, MediaPlayerElement } from 'vidstack';

  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import { watched } from '$lib/model/watch';
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

  $: watchedObject = $watched[anime.id]?.find(
    item => item.episode.number === episode.number
  );

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
    player?.enterFullscreen();
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
    {poster}
    title={episode.title}
    aspect-ratio="16/9"
    class="mx-auto flex w-screen items-center justify-center object-cover fullscreen:h-screen md:w-[max(800px,70vw)]"
    preload="metadata"
    autoplay
    autofocus
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
