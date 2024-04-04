<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import 'vidstack/bundle';
  import type { MediaPlayerElement } from 'vidstack/elements';

  export let id: string;
  export let thumbnail: string;
  export let doFade: boolean;

  let player: MediaPlayerElement;
  let isPlaying = false;

  onMount(() => {
    player?.addEventListener(
      'can-play',
      () => {
        if (document.visibilityState === 'visible') player?.play();
      },
      { once: true }
    );

    player?.addEventListener('playing', () => {
      isPlaying = true;
    });

    player?.addEventListener('end', () => {
      isPlaying = false;
    });
  });
</script>

<svelte:document
  on:visibilitychange={() => {
    if (document.visibilityState === 'visible') {
      player?.play();
    } else {
      player?.pause();
    }
  }}
/>

<div
  class="relative h-full w-full
        {doFade ? 'motion-safe:opacity-0 ' : 'motion-safe:opacity-100 '}
        transition-opacity duration-300 ease-in-out"
  in:fade|global
>
  <media-player
    src="youtube/{id}"
    class="-z-20 aspect-video h-full w-full object-cover"
    load="eager"
    muted
    autoplay
    bind:this={player}
  >
    <media-provider> </media-provider>
  </media-player>

  {#if !isPlaying}
    <img
      src={thumbnail}
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover"
      loading="eager"
      transition:fade
    />
  {/if}
</div>
