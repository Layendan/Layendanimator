<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Episode } from "$lib/model/anime";
  import test_video from "$lib/components/assets/test_video.mp4";
  import { getCurrent } from "@tauri-apps/api/window";

  // Combine this with episodeStore
  export let episode: Episode;
  export let episodeStore: Episode;
  export let percentWatched: number = 0;

  let videoSrc: string = test_video;
  let videoType: string = "video/mp4";

  let captionSrc: string = "https://media.vimejs.com/subs/english.vtt";
  let captionLang: string = "en";
  let captionLabel: string = "English";

  // These values are bound to properties of the video
  let time: number;
  let duration: number;
  let paused: boolean;
  let muted: boolean;
  let video: HTMLVideoElement;

  time = percentWatched === 100 ? 0 : (percentWatched * duration) / 1000;

  onDestroy(updateTimeWatched);

  function updateTimeWatched() {
    if (!!time && !!duration && !Number.isNaN(time) && !Number.isNaN(duration))
      episodeStore.percentWatched = (time / duration) * 100;
  }
</script>

<video
  controls
  poster={episode.thumbnail}
  preload="metadata"
  bind:currentTime={time}
  bind:duration
  bind:paused
  bind:muted
  bind:this={video}
  on:ended={() => {
    updateTimeWatched();
    // DO SOMETHING MAYBE?
    history?.back();
  }}
  on:pause={updateTimeWatched}
  on:play={() => {
    time =
      episodeStore.percentWatched === 100
        ? 0
        : (episodeStore.percentWatched * duration) / 100;
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
      case "m":
        muted = !muted;
        updateTimeWatched();
        e.preventDefault();
        break;
      case "f":
        // I hate safari. Why can't they follow standards?
        if (
          document.fullscreenElement ||
          // @ts-ignore
          document.webkitCurrentFullScreenElement
        ) {
          if (document.exitFullscreen) document.exitFullscreen();
          // @ts-ignore
          else if (document.webkitExitFullscreen) {
            // @ts-ignore
            document.webkitExitFullscreen();
          }
        } else {
          if (video.requestFullscreen) video.requestFullscreen();
          // @ts-ignore
          else if (video.webkitRequestFullscreen) {
            // @ts-ignore
            video.webkitRequestFullscreen();
          }
        }
        e.preventDefault();
        updateTimeWatched();
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
  <source src={videoSrc} type={videoType} />
  <track
    src={captionSrc}
    kind="captions"
    srclang={captionLang}
    label={captionLabel}
  />
</video>

<style>
  video {
    display: flex;
    width: 100%;
    object-fit: cover;
    align-items: center;
    justify-content: center;
    border-radius: 5px;

    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
  }

  video:focus {
    outline: none;
  }
</style>
