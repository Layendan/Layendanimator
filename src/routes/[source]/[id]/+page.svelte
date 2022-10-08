<script lang="ts">
  // Import required packages
  import { fade } from "svelte/transition";
  import loadingFailure from "$lib/components/assets/loading_failure.jpeg";
  import EpisodeHolder from "$lib/components/player/EpisodeHolder.svelte";
  import { settings } from "$lib/model/settings";
  import { library } from "$lib/model/library";
  import DOMPurify from "dompurify";
  import Button from "$lib/components/public/Button.svelte";
  import type { PageData } from "./$types";
  import Loading from "$lib/components/public/Loading.svelte";

  export let data: PageData;

  // Page scroll
  let y = 0;
  let bannerLoading: boolean = true;
  let coverLoading: boolean = true;
  let bannerError: boolean = false;
  let coverError: boolean = false;

  $: scale = y < 345 ? 0.005 * Math.abs(y) + 1 : 0.005 * 345 + 1;
  $: blur = y < 345 ? 0.05 * Math.abs(y) : 0.05 * 345;
  $: opacity = y < 345 ? -Math.abs(y) / 345 + 1 : 0;
</script>

<svelte:window bind:scrollY={y} />

{#await data.anime.data}
  <Loading />
{:then anime}
  <section in:fade>
    {#if anime.bannerImage || (anime.coverImage.large && !bannerError)}
      <div class="banner">
        {#key bannerLoading}
          <img
            src={anime.bannerImage ?? anime.coverImage.large}
            alt={anime.title.romaji}
            on:error={() => (bannerError = true)}
            on:load={() => (bannerLoading = false)}
            in:fade
            class:reduce-motion={$settings.reduceMotion}
            class:hide={bannerLoading}
            style:--banner-scale={scale}
            style:--banner-blur={`${anime.bannerImage ? blur : blur + 5}px`}
            style:--banner-opacity={opacity}
          />
        {/key}
        {#if bannerLoading}
          <img src={loadingFailure} alt={anime.title?.romaji} in:fade />
        {/if}
      </div>
    {/if}
    <div in:fade class="text">
      <div class="container">
        <div
          class="important-info"
          class:no-overlap={!!anime.bannerImage ||
            (!!anime.coverImage.large && !bannerError)}
        >
          <div
            class="image-and-choices"
            class:overlap={!!anime.bannerImage ||
              (!!anime.coverImage.large && !bannerError)}
          >
            {#key coverLoading}
              <img
                src={coverError ? loadingFailure : anime.coverImage.large}
                alt={anime.title?.english ?? anime.title?.romaji}
                on:error={() => (coverError = true)}
                on:load={() => (coverLoading = false)}
                in:fade
                class:hide={coverLoading}
                class="thumbnail"
              />
            {/key}
            {#if coverLoading}
              <img
                src={loadingFailure}
                alt={anime.title?.english ?? anime.title?.romaji}
                class="thumbnail"
                in:fade
              />
            {/if}
            <Button
              size="all"
              type={$library.subscriptions.some(
                ({ media }) => media.id === data.id
              )
                ? "danger"
                : "default"}
              on:click={() => {
                $library.subscriptions.some(({ media }) => media.id === data.id)
                  ? ($library.subscriptions = [
                      ...$library.subscriptions.filter(
                        ({ media }) => media.id !== data.id
                      ),
                    ])
                  : ($library.subscriptions = [
                      ...$library.subscriptions,
                      {
                        media: anime,
                        source: data.source,
                      },
                    ]);
              }}
            >
              {$library.subscriptions.some(({ media }) => media.id === data.id)
                ? "Unsubscribe"
                : "Subscribe"}
            </Button>
          </div>
          <div>
            <h1 class="title">
              {$settings.animeLanguage === "english"
                ? anime.title.english ?? anime.title.romaji
                : anime.title.native ?? anime.title.romaji}
            </h1>
            <p in:fade class="description">
              {@html DOMPurify.sanitize(anime.description, {
                USE_PROFILES: { html: true },
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
    <EpisodeHolder
      episodes={anime.streamingEpisodes}
      hoverAll={$settings.showProgress}
    />
  </section>
{:catch e}
  <p class="error">{e}</p>
{/await}

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
    max-height: 348px;
    object-fit: cover;
    object-position: top;
    position: relative;
  }

  .banner img:not(.reduce-motion) {
    transform: scale(var(--banner-scale));
    -webkit-filter: blur(var(--banner-blur));
    filter: blur(var(--banner-blur));
    opacity: var(--banner-opacity);
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

  .image-and-choices {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    gap: 1rem;
  }

  .text {
    z-index: 1;
    overflow: visible;
    position: relative;
    display: block;
    margin-top: 0;
    background-color: var(--secondary-color);
    padding: 1rem;
    padding-top: 0;
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

  .hide {
    display: none;
  }

  .error {
    margin: 5rem;
    margin-top: 50px;
    text-align: center;
  }
</style>
