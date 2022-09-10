<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Episode, Mirror } from "$lib/model/anime";
  import { getCurrent } from "@tauri-apps/api/window";

  // Combine this with episodeStore
  export let episode: Episode;
  export let mirror: Mirror;
  export let captions: { src: string; lang: string }[] = [];

  // These values are bound to properties of the video
  let time: number;
  let duration: number = 0;
  let paused: boolean;
  let muted: boolean;
  let video: HTMLVideoElement;
  let volume: number = 1;

  function reload() {
    video?.pause();
    video?.load();
    video?.play();
  }

  $: if (mirror) reload();

  time =
    episode.percentWatched === 100
      ? 0
      : ((episode.percentWatched ?? 0) * duration) / 1000;

  onDestroy(updateTimeWatched);

  function updateTimeWatched() {
    if (!!time && !!duration && !Number.isNaN(time) && !Number.isNaN(duration))
      episode.percentWatched = (time / duration) * 100;
  }

  function toggleFullscreen() {
    // I hate safari. Why can't they follow standards?
    if (
      document.fullscreenElement ||
      // @ts-ignore
      document.webkitCurrentFullScreenElement
    ) {
      if (document.exitFullscreen) {
        getCurrent().setFullscreen(false);
        document.exitFullscreen();
      }
      // @ts-ignore
      else if (document.webkitExitFullscreen) {
        // @ts-ignore
        document.webkitExitFullscreen();
      }
    } else {
      if (video.requestFullscreen) {
        getCurrent().setFullscreen(true);
        video.requestFullscreen();
      }
      // @ts-ignore
      else if (video.webkitRequestFullscreen) {
        // @ts-ignore
        video.webkitRequestFullscreen();
      }
    }
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    if (e.key === "f") {
      e.preventDefault();
      toggleFullscreen();
      updateTimeWatched();
    }
  }}
/>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  controls
  poster={episode.thumbnail}
  preload="metadata"
  bind:currentTime={time}
  bind:duration
  bind:paused
  bind:volume
  bind:muted
  bind:this={video}
  on:ended
  on:pause={updateTimeWatched}
  on:play={() => {
    time =
      episode.percentWatched === 100
        ? 0
        : ((episode.percentWatched ?? 0) * duration) / 100;
    updateTimeWatched();
    video.focus();
  }}
  on:keydown={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    switch (e.key) {
      case " ":
        // Checks if fullscreen since spacebar pauses automatically
        if (
          // @ts-ignore
          !document.webkitCurrentFullScreenElement
        ) {
          paused = !paused;
          e.preventDefault();
        }
        updateTimeWatched();
        break;
      case "ArrowLeft":
        time -= 5;
        e.preventDefault();
        updateTimeWatched();
        break;
      case "ArrowRight":
        time += 5;
        e.preventDefault();
        updateTimeWatched();
        break;
      case "ArrowUp":
        volume + 0.1 > 1 ? (volume = 1) : (volume += 0.1);
        e.preventDefault();
        break;
      case "ArrowDown":
        volume - 0.1 < 0 ? (volume = 0) : (volume -= 0.1);
        e.preventDefault();
        break;
      case "0":
        time = 0;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "1":
        time = duration * 0.1;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "2":
        time = duration * 0.2;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "3":
        time = duration * 0.3;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "4":
        time = duration * 0.4;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "5":
        time = duration * 0.5;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "6":
        time = duration * 0.6;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "7":
        time = duration * 0.7;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "8":
        time = duration * 0.8;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "9":
        time = duration * 0.9;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "m":
        muted = !muted;
        updateTimeWatched();
        e.preventDefault();
        break;
      default:
        break;
    }
  }}
  on:seeked={updateTimeWatched}
  on:fullscreenchange={() => {
    console.log("Fullscreen change");

    getCurrent().toggleMaximize();
  }}
>
  <source src={mirror.url} />
  {#each captions as caption}
    <track
      src={caption.src}
      kind="captions"
      label={caption.lang}
      srclang={caption.lang}
    />
  {/each}
</video>

<style>
  video {
    display: flex;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: contain;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    background-color: #000;

    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
  }

  video:not(:fullscreen) {
    max-height: 78vh;
  }

  video:not(:-webkit-full-screen) {
    max-height: 78vh;
  }

  video:focus {
    outline: none;
  }
</style>
