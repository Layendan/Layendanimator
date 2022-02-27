<script lang="ts">
  export let poster: string = "https://media.vimejs.com/poster.png";

  export let videoSrc: string = "https://media.vimejs.com/720p.mp4";
  export let videoType: string = "video/mp4";

  export let captionSrc: string = "https://media.vimejs.com/subs/english.vtt";
  export let captionLang: string = "en";
  export let captionLabel: string = "English";

  // These values are bound to properties of the video
  let time = 0;
  let duration;
  let paused = true;
</script>

<video
  controls
  allowfullscreen={true}
  bind:currentTime={time}
  bind:duration
  bind:paused
>
  <poster src={poster} />
  <source src={videoSrc} type={videoType} />
  <track
    src={captionSrc}
    kind="captions"
    srclang={captionLang}
    label={captionLabel}
  />
</video>

<style>
</style>
