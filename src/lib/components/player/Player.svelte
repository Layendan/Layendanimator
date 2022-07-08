<script lang="ts">
  import { onMount } from "svelte";
  import { animes, type Episode } from "$lib/model/anime";
  import { page } from "$app/stores";
  let window: typeof import("@tauri-apps/api/window");

  export let episode: Episode;

  export let videoSrc: string = "https://media.vimejs.com/720p.mp4";
  export let videoType: string = "video/mp4";

  export let captionSrc: string = "https://media.vimejs.com/subs/english.vtt";
  export let captionLang: string = "en";
  export let captionLabel: string = "English";

  // These values are bound to properties of the video
  let time: number = 0;
  let duration: number;
  let paused: boolean;

  // https://sapper.svelte.dev/docs/#Server-side_rendering
  // Will cause error on build since the api needs window which will not exist server side
  onMount(async () => {
    window = await import("@tauri-apps/api/window");
    let anime = $animes.get(Number.parseInt($page.params.id));
    time =
      (anime.streamingEpisodes.find((e) => e.url === episode.url)
        .percentWatched *
        duration) /
      100;
  });

  function updateTimeWatched() {
    if (time !== NaN && duration !== NaN)
      $animes
        .get(Number.parseInt($page.params.id))
        .streamingEpisodes.find((e) => e.url === episode.url).percentWatched =
        (time / duration) * 100;
  }

  setInterval(updateTimeWatched, 15000);
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
  }}
  on:pause={updateTimeWatched}
  on:play={updateTimeWatched}
  on:seeked={updateTimeWatched}
  on:fullscreenchange={() => {
    console.log("Fullscreen change");

    window?.appWindow.toggleMaximize();
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
