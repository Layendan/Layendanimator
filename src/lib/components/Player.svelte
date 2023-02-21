<script lang="ts">
  import 'vidstack/styles/base.css';
  // the following styles are optional - remove to go headless.
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  // the `.js` extension is required.
  import 'vidstack/define/media-player.js';
  import Cpu from './svg/Cpu.svelte';
  import FastForward from './svg/FastForward.svelte';
  import { defineCustomElements } from 'vidstack/elements';
  import type { MediaPlayerElement } from 'vidstack';
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

  export let sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  }[];
  export let poster: string;

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

<div class="relative w-screen h-auto bg-black -m-4 mb-4">
  <!-- svelte-ignore a11y-autofocus -->
  <media-player
    src={sources[selectedSource].url}
    {poster}
    controls
    aspect-ratio="16/9"
    class="block w-[max(calc(800px),70vw)] mx-auto object-cover"
    preload="metadata"
    autoplay
    autofocus
    bind:this={player}
  >
    <media-outlet />
  </media-player>
  <div class="bottom-4 left-4 absolute">
    <div class="dropdown dropdown-right dropdown-end">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <label
        tabindex="0"
        class="btn btn-ghost bg-black bg-opacity-60 backdrop-blur-lg w-fit"
      >
        <Cpu height={20} width={20} />
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content z-10 p-2 ml-2 shadow bg-base-200 rounded-box w-52"
      >
        {#each sources as source, i}
          <li class="m-1">
            <button
              class="btn btn-outline btn-accent w-full items-center"
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
  <!-- TODO: Check time and guess when video is ending -->
  {#if false}
    <div in:fly={{ y: 50 }} class="bottom-4 right-4 absolute">
      <button
        on:click={requestNextEpisode}
        class="btn btn-ghost items-center gap-1 bg-black bg-opacity-60 backdrop-blur-lg"
      >
        <FastForward height={20} width={20} />
        Next Episode
      </button>
    </div>
  {/if}
</div>
