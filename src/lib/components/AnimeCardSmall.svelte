<script lang="ts">
  import type { Anime } from "$lib/model/anime";
  import { fade } from "svelte/transition";
  import { settings } from "$lib/model/settings";

  export let media: Anime | undefined = undefined;
  export let episode: number | undefined = undefined;
  export let source: string | null = null;
  export let delay: number = 0;

  let name: string =
    ($settings.animeLanguage === "english"
      ? media?.title.english ?? media?.title.romaji
      : media?.title.romaji ?? media?.title.english) ?? "";
</script>

<a
  class="card"
  in:fade={{ delay }}
  href="/{source}/{media?.id}"
  class:unselectable={!media || !media?.id}
  data-sveltekit-prefetch
  on:click
>
  <div class="container" style:--color={media?.color ?? "var(--accent-color)"}>
    <img
      src={media?.coverImage?.large ?? "/assets/loading_failure.jpeg"}
      alt={name}
      loading="lazy"
    />
    <div class="overlay" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="play_button"
      viewBox="0 0 15 15"
    >
      <path
        d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
      />
    </svg>
    {#if episode}
      <p class="episode">Episode {episode}</p>
    {/if}
  </div>
  <h2>
    {#if name}
      {name}
    {:else}
      <br /><br />
    {/if}
  </h2>
</a>

<style>
  .card {
    display: inline-flex;
    position: relative;
    flex-direction: column;
    width: 156.25px;
    margin: 1rem;
    text-decoration: none;
    overflow: visible;
    outline: none;
  }

  .card .container {
    width: 156.25px;
    aspect-ratio: 0.7/1;
    object-fit: cover;
    object-position: center;
    transform: scale(1);
    transition: transform 0.2s ease-in-out;
    position: relative;
    margin: 0;
    overflow: visible;
  }

  .card .container::before {
    content: "";
    position: absolute;
    top: -8px;
    bottom: -8px;
    left: -8px;
    right: -8px;
    border: 4px solid var(--color);
    opacity: 0;
    border-radius: 16px;
    z-index: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .card .container:hover::before {
    opacity: 1;
  }

  .card:focus-visible .container::before {
    opacity: 1;
  }

  .card .container .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(var(--primary-rgb), 0);
    border-radius: 8px;
    -webkit-backdrop-filter: blur(0px);
    backdrop-filter: blur(0px);
    transition: background 0.2s ease-in-out,
      -webkit-backdrop-filter 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out;
  }

  .card .container:hover .overlay {
    background: rgba(var(--primary-rgb), 0.8);
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
  }

  .card:focus-visible .container .overlay {
    background: rgba(var(--primary-rgb), 0.8);
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
  }

  .card .container .play_button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    opacity: 1;
    fill: var(--text-color);
    fill-opacity: 0;
    transition: fill-opacity 0.2s ease-in-out;
  }

  .card .container:hover .play_button {
    fill-opacity: 1;
  }

  .card:focus-visible .container .play_button {
    fill-opacity: 1;
  }

  .card .container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
    background: url("/assets/loading_failure.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    transform: scale(1);
    transition: transform 0.2s ease-in-out;
  }

  /* Using matches so that windows edge does not change scale since it computes it wrong */
  .card .container:matches(:hover) img {
    transform: scale(0.99);
  }

  .card:matches(:focus-visible) .container img {
    transform: scale(0.99);
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

  .card:focus-visible .container .episode {
    background-color: rgba(var(--primary-rgb), 0.3);
  }

  .card h2 {
    width: auto;
    margin: 0;
    padding: 0;
    margin-top: 0.75rem;
    color: rgba(var(--text-rgb), 1);
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
    transition: color 0.2s ease-in-out;
  }

  .card h2:hover {
    color: rgba(var(--text-rgb), 0.8);
  }

  .unselectable {
    pointer-events: none;
  }
</style>
