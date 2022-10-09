<script lang="ts">
  import type { Anime } from "$lib/model/anime";
  import { fade } from "svelte/transition";
  import { settings } from "$lib/model/settings";

  export let media: Anime;
  export let episode: number | undefined = undefined;
  export let source: string | null = null;
  export let delay: number = 0;

  let name: string =
    ($settings.animeLanguage === "english"
      ? media?.title.english ?? media?.title.romaji
      : media?.title.romaji ?? media?.title.english) ?? "Loading";
</script>

<a
  class="card"
  in:fade={{ delay }}
  href={source ? `/${source}/${media?.id}` : `/${media?.id}`}
  class:unselectable={!media || !media?.id}
  data-sveltekit-prefetch
  on:click
>
  <div class="container">
    <img src={media.coverImage.large} alt={name} />
    {#if episode}
      <p class="episode">Episode {episode}</p>
    {/if}
  </div>
  <h2>{name}</h2>
</a>

<style>
  .card {
    display: inline-flex;
    position: relative;
    flex-direction: column;
    max-width: 156.25px;
    margin: 1rem;
    color: var(--text-color);
    text-decoration: none;
    overflow: visible;
    outline: none;
  }

  .card::before {
    content: "";
    position: absolute;
    top: -8px;
    bottom: -8px;
    left: -8px;
    right: -8px;
    border: 4px solid rgba(var(--accent-rgb), 0);
    border-radius: 12px;
    transition: border 0.2s ease-in-out;
  }

  .card:focus::before {
    border: 4px solid rgba(var(--accent-rgb), 0.5);
  }

  .card .container {
    width: 100%;
    aspect-ratio: 0.7/1;
    object-fit: cover;
    object-position: center;
    transform: scale(1);
    transition: transform 0.2s ease-in-out;
    position: relative;
  }

  .card .container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
  }

  .card .container .episode {
    position: absolute;
    bottom: 0.1rem;
    right: 0;
    left: 0;
    height: 2rem;
    line-height: 2rem;
    font-size: smaller;
    font-weight: bold;
    text-align: center;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background-color: rgba(var(--primary-rgb), 0.6);
    color: var(--text-color);
    margin: 0.4rem;
    border-radius: 8px;

    transition: background-color 0.2s ease-in-out;
  }

  .card .container:hover .episode {
    background-color: rgba(var(--primary-rgb), 0.3);
  }

  .card:focus .container .episode {
    background-color: rgba(var(--primary-rgb), 0.3);
  }

  .card:not(:focus) .container:hover {
    transform: scale(1.05);
  }

  .card h2 {
    width: auto;
    margin: 0;
    padding: 0;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
  }
</style>
