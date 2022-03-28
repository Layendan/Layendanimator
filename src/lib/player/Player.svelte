<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let platform;
  let getCurrent;

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
  let time = 0;
  let duration;
  let paused;
  let platformType = "";

  // Will cause error on build since the api needs window which will not exist server side
  onMount(async () => {
    const module = await import("@tauri-apps/api/window");
    getCurrent = module.default;

    const module2 = await import("@tauri-apps/api/os");
    platform = module2.default;
  });

  // have to create async function because platform() returns a promise
  async function getPlatformType() {
    platformType = await platform();
    console.log(platformType);
  }

  getPlatformType();
</script>

<video
  controls
  allowfullscreen={true}
  {poster}
  bind:currentTime={time}
  bind:duration
  bind:paused
  on:fullscreenchange={() => {
    // Not using webkit since it only applies to Safari and we don't care about Macs
    // If on windows fullscreen application
    if (platformType === "win32") {
      if (document.fullscreenElement != null) {
        // Make window fullscreen
        console.log("Is fullscreen");

        getCurrent().setFullscreen(true);
      } else {
        // Make window not fullscreen
        console.log("Is not fullscreen");

        getCurrent().setFullscreen(false);
      }
    }
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
