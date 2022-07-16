<script lang="ts">
  import { page } from "$app/stores";
  import type { Episode } from "$lib/model/anime";

  export let episode: Episode;
  let thumbnail: string | null = episode.thumbnail;
</script>

<div class="episode">
  <a
    class="link"
    href="{$page.url.pathname}/watch?episode={JSON.stringify(episode)}"
  >
    <img class="bg" src={episode.thumbnail} alt="" />
    <div class="bg progress" style="width: {episode.percentWatched ?? '0'}%;" />
    <span>
      {#if !!thumbnail}
        <img
          class="image"
          src={thumbnail}
          alt={episode.title}
          loading="lazy"
          on:error={() => (thumbnail = null)}
        />
      {/if}
      <p>
        {episode.title} on <i>{episode.site}</i>
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
    filter: none;
    transition: width 0.5s ease-in-out, opacity 0.4s ease-in-out;
  }

  .image {
    position: relative;
    display: block;
    width: 100px;
    height: auto;
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

  p {
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
