<script lang="ts">
  // Import required packages
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import loadingFailure from "$lib/components/assets/loading_failure.jpeg";
  import EpisodeHolder from "$lib/components/player/EpisodeHolder.svelte";
  import { settings } from "$lib/model/settings";
  import DOMPurify from "dompurify";
  import { animes, type Anime } from "$lib/model/anime";

  let anime: Anime = $animes.get(Number.parseInt($page.params.id));

  // Page scroll
  let y = 0;

  $: scale = y < 345 ? 0.005 * Math.abs(y) + 1 : 0.005 * 345 + 1;
  $: blur = `${y < 345 ? 0.05 * Math.abs(y) : 0.05 * 345}px`;
  $: brightness = y < 345 ? -Math.abs(y) / 345 + 1 : 0;
</script>

<svelte:window bind:scrollY={y} />

{#if anime}
  <section transition:fade>
    {#if !!anime.bannerImage}
      <div class="banner">
        <img
          src={anime.bannerImage}
          alt={anime.title.english ?? anime.title.romaji}
          transition:fade
          class:reduce-motion={$settings.reduceMotion}
          style:--banner-scale={scale}
          style:--banner-blur={blur}
          style:--banner-brightness={brightness}
        />
      </div>
    {/if}
    <div transition:fade class="text">
      <div class="container">
        <div class="important-info" class:no-overlap={!anime.bannerImage}>
          <img
            src={anime.coverImage.large}
            transition:fade
            on:error={() => (anime.coverImage.large = loadingFailure)}
            class:overlap={!!anime.bannerImage}
            class="thumbnail"
            alt={anime.title.english ?? anime.title.romaji}
          />
          <div>
            <p class="title">{anime.title.english ?? anime.title.romaji}</p>
            <p transition:fade class="description">
              {@html DOMPurify.sanitize(anime.description, {
                USE_PROFILES: { html: true },
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
    <EpisodeHolder episodes={anime.streamingEpisodes} />
  </section>
{/if}

<style>
  .banner {
    width: 100%;
    z-index: 0;
    display: block;
    overflow: hidden;
    position: relative;
  }

  .banner img {
    width: 100%;
    height: 348px;
    object-fit: cover;
    object-position: center;
    position: relative;
  }

  .banner img:not(.reduce-motion) {
    transform: scale(var(--banner-scale));
    -webkit-filter: blur(var(--banner-blur))
      brightness(var(--banner-brightness));
    filter: blur(var(--banner-blur)) brightness(var(--banner-brightness));
  }

  .banner::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      to bottom,
      rgba(var(--secondary-rgb), 0.2) 50%,
      rgba(var(--secondary-rgb), 1) 100%
    );
  }

  .text {
    z-index: 1;
    overflow: visible;
    position: relative;
    display: block;
    margin-top: 0;
    background-color: var(--secondary-color);
    padding: 1rem;
  }

  .overlap {
    margin-top: -125px;
  }

  .no-overlap {
    margin-top: 40px;
  }

  .thumbnail {
    z-index: inherit;
    position: relative;
    border-radius: 5px;
    height: fit-content;
    max-height: 305px;
  }

  .important-info {
    display: grid;
    grid-column-gap: 30px;
    grid-template-columns: 215px auto;
    min-width: 320px;
  }

  .container {
    display: table;
    margin: 0 auto;
  }

  .title {
    font-size: x-large;
    font-weight: 300;
  }
  .description {
    max-width: 900px;
    font-size: small;
    font-weight: 300;
    line-height: 1.5;
    height: min-content;
  }
</style>
