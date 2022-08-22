<script lang="ts">
  import { onDestroy } from "svelte";
  import { animes, type Episode } from "$lib/model/anime";
  import { page } from "$app/stores";
  import test_video from "$lib/components/assets/test_video.mp4";
  import { getCurrent } from "@tauri-apps/api/window";

  export let episode: Episode;
  let episodeStore: Episode;

  export let videoSrc: string = test_video;
  export let videoType: string = "video/mp4";

  export let captionSrc: string = "https://media.vimejs.com/subs/english.vtt";
  export let captionLang: string = "en";
  export let captionLabel: string = "English";

  // These values are bound to properties of the video
  let time: number;
  let duration: number;
  let paused: boolean;
  let muted: boolean;
  let video: HTMLVideoElement;

  episodeStore = $animes
    .get(Number.parseInt($page.params.id))
    .streamingEpisodes.find((e) => e.url === episode.url);
  time =
    episodeStore.percentWatched === 100
      ? 0
      : (episodeStore.percentWatched * duration) / 1000;

  onDestroy(updateTimeWatched);

  function updateTimeWatched() {
    if (!!time && !!duration && time !== NaN && duration !== NaN)
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
    console.log(e.key);
    switch (e.key) {
      case " ":
        paused = !paused;
        updateTimeWatched();
        break;
      case "ArrowLeft":
        time -= 5;
        updateTimeWatched();
        break;
      case "ArrowRight":
        time += 5;
        updateTimeWatched();
        break;
      case "m":
        muted = !muted;
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
    height: 100%;
    object-fit: cover;
    align-items: center;
    justify-content: center;
  }
</style>
