<script lang="ts">
  import { Player, Video, DefaultUi } from "@vime/svelte";

  export let poster: string = "https://media.vimejs.com/poster.png";

  export let videoSrc: string = "https://media.vimejs.com/720p.mp4";
  export let videoType: string = "video/mp4";

  export let captionSrc: string = "https://media.vimejs.com/subs/english.vtt";
  export let captionLang: string = "en";
  export let captionLabel: string = "English";
</script>

<Player
  controls
  autoplay={true}
  theme="dark"
  style="--vm-player-theme: #895ef4;"
>
  <!-- Provider component is placed here. -->
  <Video {poster} class="player">
    <!-- These are passed directly to the underlying HTML5 `<video>` element. -->
    <!-- Why `data-src`? Lazy loading, you can always use `src` if you prefer.  -->
    <source data-src={videoSrc} type={videoType} />
    <track
      default
      kind="captions"
      src={captionSrc}
      srclang={captionLang}
      label={captionLabel}
    />
  </Video>
</Player>

<style>
  .player {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
