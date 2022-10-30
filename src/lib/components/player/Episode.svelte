<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import type { Episode } from "$lib/model/anime";
  import { fade } from "svelte/transition";

  export let episode: Episode;
  export let hover: boolean = false;
  export let selected: boolean = false;
  export let delay: number = 0;
  export let shouldReplace: boolean = false;
  let thumbnail: string | null = episode.thumbnail;
</script>

<div class="episode" class:hover class:selected in:fade={{ delay }}>
  <a
    on:click|preventDefault={() =>
      goto(
        `/${$page.params.source}/${$page.params.id}/watch?episode=${episode.number}`,
        { replaceState: shouldReplace }
      )}
    href="/{$page.params.source}/{$page.params
      .id}/watch?episode={episode.number}"
    data-sveltekit-prefetch
  >
    <img class="bg" src={episode.thumbnail} alt="" />
    <div class="bg progress" style="width: {episode.percentWatched ?? '0'}%;" />
    <span>
      {#if !!thumbnail}
        <img
          class="image"
          src={thumbnail}
          alt={episode.name}
          loading="lazy"
          on:error={() => (thumbnail = null)}
        />
      {/if}
      <p>
        Episode {episode.number}
        {#if episode.name}
          - {episode.name}
        {/if}
        {#if episode.site}
          on {episode.site}
        {/if}
        {#if episode.subOrDub}
          - {episode.subOrDub.toLocaleUpperCase()}
        {/if}
      </p>
    </span>
  </a>
</div>

<style>
  .bg {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 75px;
    object-fit: cover;
    object-position: center;
    filter: blur(10px) brightness(75%);
    transition: opacity 0.5s ease-in-out;
  }

  .progress {
    background: var(--accent-color);
    height: 100%;
    filter: none;
    transition: width 0.5s ease-in-out, opacity 0.4s ease-in-out;
  }

  .image {
    position: relative;
    display: block;
    width: 100px;
    aspect-ratio: 16/9;
    margin-right: 2em;
    border-radius: 5px;
    opacity: 1;
  }

  .episode {
    background-color: var(--secondary-color);
    border-radius: 5px;
    margin-left: 2em;
    margin-right: 2em;
    padding-bottom: 10px;
    padding-top: 10px;
    margin-top: 5px;
    overflow: hidden;
    position: relative;
    transition: background-color 0.1s ease-in-out;
  }

  .episode:hover {
    background-color: var(--tertiary-color);
  }

  .episode:hover .bg {
    opacity: 0.2;
  }

  .episode:hover .progress {
    opacity: 0.5;
  }

  .hover .progress {
    opacity: 0.5;
  }

  .selected {
    border-left: solid 2px var(--accent-color);
    border-right: solid 2px var(--accent-color);
  }

  .episode:focus-within {
    outline: 1px solid var(--accent-color);
    background-color: var(--tertiary-color);
  }

  .episode:focus-within .bg {
    opacity: 0.2;
  }

  .episode:focus-within .progress {
    opacity: 0.5;
  }

  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow-y: hidden;
    -webkit-line-clamp: 1;
    height: max-content;
    transition: color 0.2s ease-in-out;
  }

  span {
    display: flex;
    flex-direction: row;
    position: relative;
    margin-left: 2em;
    margin-right: 2em;
  }

  a {
    text-decoration: none;
    font-weight: normal;
    color: var(--text-color);
  }
</style>
