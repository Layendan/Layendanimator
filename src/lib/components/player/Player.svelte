<svelte:options immutable />

<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
  import type { Episode, Mirror } from "$lib/model/anime";
  import { getCurrent } from "@tauri-apps/api/window";
  import Hls from "hls.js";

  // Combine this with episodeStore
  export let episode: Episode;
  export let mirror: Mirror;
  export let title: string = episode.title ?? `Episode - ${episode.number}`;
  export let captions: { src: string; lang: string }[] = [];
  export let nextEpisode: Episode | undefined;
  export let autoplay: boolean;

  // These values are bound to properties of the video
  let time: number;
  let duration: number = 0;
  let paused: boolean;
  let muted: boolean;
  let video: HTMLVideoElement;
  let volume: number = 1;

  function reload() {
    video?.pause();
    updateTimeWatched();
    setHls();
    video?.load();
    video?.play();
  }

  function playNext() {
    if (nextEpisode) {
      goto(
        `/${$page.params.source}/${$page.params.id}/watch?episode=${nextEpisode.number}&autoplay=true`
      );
    } else {
      goto(`/${$page.params.source}/${$page.params.id}`);
    }
  }

  function setHls() {
    if (video?.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = `${mirror.url}#t=${
        episode.percentWatched === 100
          ? 0
          : ((episode.percentWatched ?? 0) * duration) / 100
      }`;
    } else {
      console.log("Using HLS.js");
      const hls = new Hls();
      hls.loadSource(
        `${mirror.url}#t=${
          episode.percentWatched === 100
            ? 0
            : ((episode.percentWatched ?? 0) * duration) / 100
        }`
      );
      hls.attachMedia(video);
    }
    video?.load();
  }

  $: if (mirror) reload();

  function updateTimeWatched() {
    if (!Number.isNaN(time) && !Number.isNaN(duration))
      episode.percentWatched = (time / duration) * 100;
  }

  onMount(setHls);

  onDestroy(() => {
    updateTimeWatched();
  });

  function enterFullscreen() {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
    // @ts-ignore
    else if (video.webkitRequestFullscreen) {
      // @ts-ignore
      video.webkitRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    // @ts-ignore
    else if (document.webkitExitFullscreen) {
      // @ts-ignore
      document.webkitExitFullscreen();
    }
  }

  function toggleFullscreen() {
    // I hate safari. Why can't they follow standards?
    if (
      document.fullscreenElement ||
      // @ts-ignore
      document.webkitCurrentFullScreenElement
    ) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<svelte:window
  on:keydown={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    if (e.key === "f") {
      toggleFullscreen();
      video.focus();
      e.preventDefault();
    } else if (e.key === "N" && nextEpisode) {
      playNext();
      e.preventDefault();
    }
  }}
/>

<!-- svelte-ignore a11y-media-has-caption -->
<video
  controls
  poster={episode.thumbnail}
  preload="metadata"
  {autoplay}
  bind:currentTime={time}
  bind:duration
  bind:paused
  bind:volume
  bind:muted
  bind:this={video}
  on:ended={playNext}
  on:click={() => video.focus()}
  on:play={() => video.focus()}
  on:keydown={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    switch (e.key) {
      case " ":
        // Checks if fullscreen since spacebar pauses automatically
        // Checks to see if using edge since spacebar pauses automatically
        if (
          // @ts-ignore
          !document.webkitCurrentFullScreenElement &&
          !document.exitFullscreen
        ) {
          paused = !paused;
          e.preventDefault();
        }
        break;
      case "ArrowLeft":
        time -= e.shiftKey ? 10 : 5;
        e.preventDefault();
        break;
      case "ArrowRight":
        time += e.shiftKey ? 10 : 5;
        e.preventDefault();
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
        e.preventDefault();
        break;
      case "1":
        time = duration * 0.1;
        e.preventDefault();
        break;
      case "2":
        time = duration * 0.2;
        e.preventDefault();
        break;
      case "3":
        time = duration * 0.3;
        e.preventDefault();
        break;
      case "4":
        time = duration * 0.4;
        e.preventDefault();
        break;
      case "5":
        time = duration * 0.5;
        e.preventDefault();
        break;
      case "6":
        time = duration * 0.6;
        e.preventDefault();
        break;
      case "7":
        time = duration * 0.7;
        e.preventDefault();
        break;
      case "8":
        time = duration * 0.8;
        e.preventDefault();
        break;
      case "9":
        time = duration * 0.9;
        e.preventDefault();
        break;
      case "m":
        muted = !muted;
        e.preventDefault();
        break;
      default:
        break;
    }
  }}
  on:fullscreenchange={() => {
    if (document.fullscreenElement) {
      getCurrent().setFullscreen(true);
    } else {
      getCurrent().setFullscreen(false);
    }
  }}
>
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
