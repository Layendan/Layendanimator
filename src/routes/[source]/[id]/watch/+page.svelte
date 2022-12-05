<svelte:options immutable />

<script lang="ts">
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import { settings } from "$lib/model/settings";
  import Player from "$lib/components/player/Player.svelte";
  import Button from "$lib/components/public/Button.svelte";
  import Loading from "$lib/components/public/Loading.svelte";
  import ExternalIcon from "$lib/components/assets/ExternalIcon.svelte";
  import ExternalLink from "$lib/components/public/ExternalLink.svelte";

  export let data: PageData;
  export const ssr = false;

  let selectedMirror: number = 0;
  let name: string =
    ($settings.animeLanguage === "english"
      ? data?.title.english ?? data?.title.romaji
      : data?.title.romaji ?? data?.title.english) ?? "";
</script>

<div class="holder">
  {#await data.mirrors.data}
    <Loading />
  {:then mirrors}
    <div in:fade class="player">
      <Player
        episode={data.episode}
        title="{name} ・ {data.episode.name ??
          `Episode - ${data.episode.number}`}"
        mirror={mirrors[selectedMirror]}
        captions={mirrors[selectedMirror]?.subtitles}
        nextEpisode={data.nextEpisode}
        autoplay={data.autoplay}
      />
      <div class="info">
        <h1>{data.title.english ?? data.title.romaji}</h1>
        <h2>{data.episode.name ?? `Episode - ${data.episode.number}`}</h2>
        <span class="mirrors">
          {#each mirrors ?? [] as { name, quality }, i}
            <Button
              on:click={() => (selectedMirror = i)}
              disabled={selectedMirror === i}
            >
              {name ?? quality ?? `Mirror ${i + 1}`}
            </Button>
          {/each}
        </span>
        {#if mirrors[selectedMirror]?.downloadLink}
          <div class="download">
            <ExternalLink href={mirrors[selectedMirror].downloadLink}>
              <Button>
                Download
                <ExternalIcon />
              </Button>
            </ExternalLink>
          </div>
        {/if}
        <p>
          {@html data.episode.description || (data.description ?? "")}
        </p>
      </div>
    </div>
  {:catch e}
    <h1>Failed to load episode<br /><br />{e}</h1>
  {/await}
</div>

<style>
  .player {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    margin-top: 1rem;
    gap: 1em;
  }

  .info {
    border-radius: 5px;
    padding: 1em;
    background-color: var(--secondary-color);
  }

  .info > h1 {
    font-size: 1.5em;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .info > h2 {
    font-size: 1.25em;
    margin-bottom: 1rem;
    font-weight: 400;
    font-style: italic;
  }

  .info > p {
    line-height: 1.25rem;
    font-weight: 300;
  }

  .mirrors {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }

  .download {
    margin-top: 0.5rem;
  }

  .holder {
    width: 100%;
  }
</style>
