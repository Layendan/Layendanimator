<script lang="ts">
  import EpisodeHolder from "$lib/components/player/EpisodeHolder.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  let isTheaterMode: boolean = false;
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    if (e.key === "t") {
      e.preventDefault();
      isTheaterMode = !isTheaterMode;
    }
  }}
/>

<section class:theater={isTheaterMode}>
  <slot />
  <div class="episodes">
    <EpisodeHolder
      episodes={data.episodes}
      hoverAll={data.showProgress}
      selectedEpisode={data.episode}
    />
  </div>
</section>

<style>
  section {
    margin-top: 3rem;
    margin-left: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;

    transition: margin 0s ease;
  }

  .theater {
    flex-direction: column;
    margin-right: 1rem;
  }

  section:not(.theater) > .episodes {
    width: 70%;
    height: 100%;
  }
</style>
