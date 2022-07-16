<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { animes, type Episode } from "$lib/model/anime";
  import { page } from "$app/stores";
  import test_video from "$lib/components/assets/test_video.mp4";
  let window: typeof import("@tauri-apps/api/window");

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

  // https://sapper.svelte.dev/docs/#Server-side_rendering
  // Will cause error on build since the api needs window which will not exist server side
  onMount(async () => {
    window = await import("@tauri-apps/api/window");
    episodeStore = $animes
      .get(Number.parseInt($page.params.id))
      .streamingEpisodes.find((e) => e.url === episode.url);
    time = (episodeStore.percentWatched * duration) / 100;
  });

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
  on:ended={() => {
    updateTimeWatched();
    // DO SOMETHING MAYBE?
    history?.back();
  }}
  on:pause={updateTimeWatched}
  on:play={() => {
    time = (episodeStore.percentWatched * duration) / 100;
    updateTimeWatched();
  }}
  on:seeked={updateTimeWatched}
  on:fullscreenchange={() => {
    console.log("Fullscreen change");

    window?.getCurrent().toggleMaximize();
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
