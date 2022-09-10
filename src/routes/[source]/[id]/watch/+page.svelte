<svelte:options immutable />

<script lang="ts">
  import Player from "$lib/components/player/Player.svelte";
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import DOMPurify from "dompurify";
  import JsSandbox, {
    getStreamingLinks,
  } from "$lib/components/JsSandbox.svelte";
  import type { Mirror } from "$lib/model/anime";
  import Button from "$lib/components/public/Button.svelte";
  import Loading from "$lib/components/public/Loading.svelte";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let isSandboxLoaded: boolean = false;
  let selectedMirror: Mirror;

  async function preload(id: string): Promise<Mirror[]> {
    const mirrors = data.episode.mirrors ?? (await getStreamingLinks(id));
    data.episode.mirrors = mirrors;
    selectedMirror = mirrors[0];
    return mirrors;
  }
</script>

<JsSandbox
  jsFile={data.source.srcPath}
  on:load={() => (isSandboxLoaded = true)}
/>

<div class="holder">
  {#if isSandboxLoaded}
    {#await preload(data.episode.id)}
      <Loading />
    {:then mirrors}
      <div in:fade class="player">
        <Player
          episode={data.episode}
          mirror={selectedMirror}
          on:ended={() => goto(`/${data.source.id}/${data.id}`)}
        />
        <div class="info">
          <h1>{data.episode.title ?? `Episode - ${data.episode.number}`}</h1>
          <span class="mirrors">
            {#each mirrors ?? [] as mirror, i}
              <Button
                on:click={() => (selectedMirror = mirror)}
                disabled={selectedMirror.url === mirror.url}
              >
                {mirror.name ?? `Mirror ${i + 1}`}
              </Button>
            {/each}
          </span>
          <h2>
            {@html DOMPurify.sanitize(data.episode.description ?? "", {
              USE_PROFILES: { html: true },
            })}
          </h2>
        </div>
      </div>
    {/await}
  {:else}
    <Loading />
  {/if}
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

  .mirrors {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }

  .holder {
    width: 100%;
  }
</style>
