<script lang="ts">
  import { onMount } from 'svelte';

  export let sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  }[];

  export let poster: string | null = null;

  let video: HTMLVideoElement;
  let paused = true;
  let volume = 1;
  let muted = false;
  let currentTime = 0;
  let duration = 0;
  let buffered: TimeRanges = { length: 0, start: () => 0, end: () => 0 };
  let playbackRate = 1;

  let selectedSource = sources.length - 1;
  let playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  function play() {
    if (
      // @ts-ignore
      !document.webkitCurrentFullScreenElement &&
      !document.exitFullscreen
    )
      paused = !paused;
  }

  function isFullscreen(): boolean {
    // @ts-ignore
    return !!document.webkitCurrentFullScreenElement;
  }

  function enterFullscreen() {
    // @ts-ignore
    if (video.webkitRequestFullscreen) {
      // @ts-ignore
      video.webkitRequestFullscreen();
    }
  }

  function exitFullscreen() {
    // @ts-ignore
    if (document.webkitExitFullscreen) {
      // @ts-ignore
      document.webkitExitFullscreen();
    }
  }

  function fullScreen() {
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  // rewind the current time
  function rewind() {
    currentTime -= 10;
  }

  // forward the current time
  function forward() {
    currentTime += 10;
  }

  onMount(() => {
    console.debug(video.src);
  });
</script>

<svelte:body
  on:keydown={e => {
    if (e.key === ' ') {
      play();
    } else if (e.key === 'f') {
      fullScreen();
    } else if (e.key === 'ArrowLeft') {
      rewind();
    } else if (e.key === 'ArrowRight') {
      forward();
    }
  }}
/>

<div class="relative w-[56rem] aspect-video">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    bind:this={video}
    bind:paused
    bind:buffered
    bind:currentTime
    bind:duration
    bind:muted
    bind:volume
    bind:playbackRate
    {poster}
    controls
    class="w-full h-full object-cover rounded-md bg-black"
  >
    <source
      src={sources[selectedSource].url}
      type={sources[selectedSource].isM3U8
        ? 'application/x-mpegURL'
        : 'video/mp4'}
    />
    <slot />
  </video>
</div>
