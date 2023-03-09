<script lang="ts">
  import 'vidstack/styles/base.css';
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  import 'vidstack/define/media-player.js';
  import type { MediaPlayerElement } from 'vidstack';
  import { defineCustomElements } from 'vidstack/elements';

  import Fa from 'svelte-fa';
  import { faMicrochip, faDownload } from '@fortawesome/free-solid-svg-icons';
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';

  export let sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  }[];
  export let poster: string;
  export let download: string | undefined = undefined;

  let player: MediaPlayerElement;
  let subscriptions: (() => void)[] = [];

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
    // TODO: Replace with bindings when video element comes back
    subscriptions.push(
      player.subscribe(({ duration }) => {
        console.log('Duration:', duration);
      })
    );
    subscriptions.push(
      player.subscribe(({ paused, playing }) => {
        console.log('Paused:', paused);
        console.log('Playing:', playing);
      })
    );
  });

  onDestroy(() => {
    subscriptions.forEach(unsubscribe => unsubscribe());
  });
</script>

<div
  class="relative -m-4 mb-4 h-auto w-screen border-b-2 border-accent bg-black"
>
  <!-- svelte-ignore a11y-autofocus -->
  <media-player
    src={sources[selectedSource].url}
    {poster}
    controls
    aspect-ratio="16/9"
    class="mx-auto block object-cover md:w-[max(calc(800px),70vw)]"
    preload="metadata"
    autoplay
    autofocus
    prefer-native-hls
    bind:this={player}
    on:error
  >
    <media-outlet />
  </media-player>
  <div class="absolute bottom-4 left-4">
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
