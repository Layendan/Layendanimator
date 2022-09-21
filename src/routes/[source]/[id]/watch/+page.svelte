<svelte:options immutable />

<script lang="ts">
  import Player from "$lib/components/player/Player.svelte";
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import DOMPurify from "dompurify";
  import Button from "$lib/components/public/Button.svelte";
  import Loading from "$lib/components/public/Loading.svelte";
  import { open } from "@tauri-apps/api/shell";

  export let data: PageData;

  let selectedMirror: number = 0;
</script>

<div class="holder">
  {#await data.mirrors}
    <Loading />
  {:then mirrors}
    <div in:fade class="player">
      <Player
        episode={data.episode}
        title="{data.title.english ?? data.title.romaji} ・ {data.episode
          .title ?? `Episode - ${data.episode.number}`}"
        mirror={mirrors[selectedMirror]}
        nextEpisode={data.nextEpisode}
        autoplay={data.autoplay}
      />
      <div class="info">
        <h1>{data.title.english ?? data.title.romaji}</h1>
        <h2>{data.episode.title ?? `Episode - ${data.episode.number}`}</h2>
        <span class="mirrors">
          {#each mirrors ?? [] as { name }, i}
            <Button
              on:click={() => (selectedMirror = i)}
              disabled={selectedMirror === i}
            >
              {name ?? `Mirror ${i + 1}`}
            </Button>
          {/each}
        </span>
        <div class="download">
          <Button on:click={() => open(mirrors[selectedMirror].downloadLink)}>
            Download
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style="transform: translateY(2px);"
            >
              <path
                d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </div>
        <h2>
          {@html DOMPurify.sanitize(data.episode.description ?? "", {
            USE_PROFILES: { html: true },
          })}
        </h2>
      </div>
    </div>
  {:catch e}
    <h1>Failed to load episode</h1>
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
    font-size: 1em;
    margin-bottom: 1rem;
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
