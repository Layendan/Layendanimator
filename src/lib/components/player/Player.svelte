<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  let window: typeof import("@tauri-apps/api/window");

  export let poster: string =
    $page.url.searchParams.get("poster") != "null"
      ? $page.url.searchParams.get("poster")
      : "https://media.vimejs.com/poster.png";

  let url = $page.url.searchParams.get("url");

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
  });
</script>

<video
  controls
  {poster}
  preload="metadata"
  bind:currentTime={time}
  bind:duration
  bind:paused
  on:fullscreenchange={() => {
    console.log("Fullscreen change");

    // Call rust method for fullscreen
    invoke(window.appWindow.label);
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
