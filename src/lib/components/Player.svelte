<script lang="ts">
  import 'vidstack/styles/base.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  import 'vidstack/define/media-player.js';
  import { defineCustomElements } from 'vidstack/elements';

  import Fa from 'svelte-fa';
  import { faMicrochip, faDownload } from '@fortawesome/free-solid-svg-icons';
  import { onMount, createEventDispatcher } from 'svelte';
  import { watched } from '$lib/model/watch';
  import type { Anime, Episode } from '$lib/model/Anime';
  import { beforeNavigate } from '$app/navigation';

  export let sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  }[];
  export let poster: string;
  export let anime: Anime;
  export let episode: Episode;
  export let download: string | undefined = undefined;

  $: watchedObject = $watched[anime.id]?.find(
    item => item.episode.number === episode.number
  );

  const defaultIndex = sources.findIndex(
    source => source.quality === 'default'
  );
  let selectedSource = defaultIndex !== -1 ? defaultIndex : 0;
  const dispatcher = createEventDispatcher();

  function requestNextEpisode() {
    dispatcher('requestNextEpisode');
  }

  onMount(async () => {
    await defineCustomElements();
    const player = document.querySelector('media-player');
    player?.onAttach(() => {
      player.currentTime =
        (watchedObject?.time ?? 0) < (player.state.duration || anime.duration)
          ? watchedObject?.time ?? 0
          : 0;
    });
  });

  beforeNavigate(() => {
    const state = document.querySelector('media-player')?.state;
    if (state) {
      watched.add(anime.id, {
        episode,
        time: state.currentTime ?? 0,
        percentage:
          state.currentTime / (state.duration || anime.duration || Infinity)
      });
    }
  });
</script>

<div class="relative -m-4 mb-4 h-auto w-screen bg-black">
  <!-- svelte-ignore a11y-autofocus -->
  <media-player
    src="https://jb-proxy.app.jet-black.xyz/{sources[selectedSource].url}"
    {poster}
    controls
    aspect-ratio="16/9"
    class="mx-auto block w-screen object-cover md:w-[max(calc(800px),70vw)]"
    preload="metadata"
    autoplay
    autofocus
    prefer-native-hls
    on:ended={requestNextEpisode}
  >
    <media-outlet />
  </media-player>
  <div class="absolute left-4 bottom-4">
    <div class="dropdown-right dropdown-end dropdown">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn-ghost btn ">
        <Fa icon={faMicrochip} size="1.5x" />
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content rounded-box z-10 ml-2 w-52 bg-base-200 p-2 shadow"
      >
        {#each sources as source, i}
          <li class="m-1">
            <button
              tabindex="0"
              class="btn-outline btn-accent btn w-full items-center"
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
  {#if download}
    <a
      href={download}
      target="_blank"
      rel="noreferrer"
      class="btn-ghost btn absolute bottom-4 right-4"
    >
      <Fa icon={faDownload} size="1.5x" />
    </a>
  {/if}
</div>
