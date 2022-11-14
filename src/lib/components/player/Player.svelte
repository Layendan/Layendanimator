<script lang="ts">
  import { goto, invalidate, prefetch } from "$app/navigation";
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
  import { getCurrent } from "@tauri-apps/api/window";
  import type { Episode, Mirror } from "$lib/model/anime";
  import Hls from "hls.js";

  export let episode: Episode;
  export let mirror: Mirror;
  export let title: string = episode.name ?? `Episode - ${episode.number}`;
  export let captions: { src: string; lang: string }[] = [];
  export let nextEpisode: Episode | undefined;
  export let autoplay: boolean;

  // These values are bound to properties of the video
  let time: number;
  let duration: number;
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
        `/${$page.params.source}/${$page.params.id}/watch?episode=${nextEpisode.number}&autoplay=true`,
        { replaceState: true }
      );
    } else {
      exitFullscreen();
      history.back();
    }
  }

  function setHls() {
    if (mirror?.isM3U8) {
      console.log("Using HLS.js");
      const hls = new Hls({
        startPosition:
          episode.percentWatched === 100
            ? -1
            : ((episode.percentWatched ?? 0) *
                (episode.duration ?? duration ?? 0)) /
              100,
      });
      hls.loadSource(mirror.url);
      hls.attachMedia(video);
    } else {
      video.src = `${mirror.url}#t=${
        episode.percentWatched === 100
          ? 0
          : ((episode.percentWatched ?? 0) *
              (episode.duration ?? duration ?? 0)) /
            100
      }`;
    }
    video?.load();
  }

  // Reloads when mirror changes
  $: if (mirror) reload();

  function updateTimeWatched() {
    if (!!time && !!duration) episode.percentWatched = (time / duration) * 100;
  }

  onMount(() => {
    setHls();
    video.addEventListener("webkitfullscreenchange", () => {
      if (document.fullscreenElement) {
        getCurrent().setFullscreen(true);
      } else {
        getCurrent().setFullscreen(false);
      }
    });
    if (nextEpisode)
      prefetch(
        `/${$page.params.source}/${$page.params.id}/watch?episode=${nextEpisode.number}`
      );
  });

  onDestroy(updateTimeWatched);

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

  function toggleFullscreen() {
    if (
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
  on:loadedmetadata={() => (episode.duration ??= duration)}
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
  on:error={() => {
    updateTimeWatched();
    invalidate(`${episode.id}/mirrors`);
  }}
>
  {#if captions}
    {#each captions as caption}
      <track
        src={caption.src}
        kind="captions"
        label={caption.lang}
        srclang={caption.lang}
      />
    {/each}
  {/if}
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

  video:not(:is(:fullscreen, :-webkit-full-screen)) {
    max-height: 78vh;
  }

  video:focus-visible {
    outline: none;
  }
</style>
