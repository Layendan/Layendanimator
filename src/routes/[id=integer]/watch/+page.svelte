<script lang="ts">
  import Player from "$lib/components/player/Player.svelte";
  import EpisodeHolder from "$lib/components/player/EpisodeHolder.svelte";
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import DOMPurify from "dompurify";
  import { settings } from "$lib/model/settings";

  export let data: PageData;
</script>

{#await data.anime then { streamingEpisodes }}
  <section in:fade>
    <div class="player">
      <Player
        episode={data.episode}
        episodeStore={streamingEpisodes.find((e) => e.url === data.episode.url)}
        percentWatched={data.episode.percentWatched ?? 0}
      />
      <div class="info">
        <h1>{data.episode.title}</h1>
        <h2>
          {@html DOMPurify.sanitize(data.episode.description, {
            USE_PROFILES: { html: true },
          })}
        </h2>
      </div>
    </div>
    <div class="episodes">
      <EpisodeHolder
        episodes={streamingEpisodes}
        hoverAll={$settings.showProgress}
      />
    </div>
  </section>
{/await}

<style>
  section {
    margin-top: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .player {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    margin: 1em;
    margin-right: 0px;
    gap: 1em;
  }

  .info {
    border: 2px solid var(--tertiary-color);
    border-radius: 5px;
    padding: 1em;
    background-color: var(--secondary-color);
  }

  .info > h1 {
    font-size: 1.5em;
    margin-top: 0.5rem;
    margin-bottom: 0.5em;
  }

  .info > h2 {
    font-size: 1em;
    margin-bottom: 0.5em;
    font-weight: lighter;
  }

  .episodes {
    width: 70%;
    height: 100%;
  }
</style>
