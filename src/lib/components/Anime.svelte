<script lang="ts">
  // Import required packages
  import loadingFailure from "$lib/components/assets/loading_failure.jpeg";
  import { fade } from "svelte/transition";
  import DOMPurify from "dompurify";
  import { settings } from "$lib/model/settings";
  import type { Anime } from "$lib/model/anime";

  export let media: Anime | null = null;
  export let source: string | null = null;

  export let episode: number | null = null;
  export let airingAt: number | null = null;

  export let delay: number = 0;
  export let expanded: boolean = false;

  let name: string =
    ($settings.animeLanguage === "english"
      ? media?.title.english ?? media?.title.romaji
      : media?.title.romaji ?? media?.title.english) ?? "Loading";
  let airingTime: Date = new Date((airingAt ?? 0) * 1000);
  const today = new Date();

  let loading: boolean = true;
  let loadingFailureBool: boolean = false;

  // Check if there is data to store before looking at the length or else returns null error
  const DATA_NAME = name + "-episodes";
  if (
    media?.streamingEpisodes &&
    media?.streamingEpisodes.length > 0 &&
    !window?.sessionStorage.getItem(DATA_NAME)
  ) {
    window?.sessionStorage.setItem(
      DATA_NAME,
      JSON.stringify(media?.streamingEpisodes)
    );
  }
</script>

<body in:fade={{ delay }} class:expanded>
  <a
    href={source ? `/${source}/${media?.id}` : `/${media?.id}`}
    class:unselectable={!media || !media?.id}
    on:click
  >
    <span class="holder">
      {#key loading}
        <!-- Removing lazy loading because it prevents images from loading in ms edge, might change display: none to width+height: 0 -->
        <img
          src={loadingFailureBool ? loadingFailure : media?.coverImage.large}
          alt={name}
          class="thumbnail"
          class:hide={loading}
          on:error={() => (loadingFailureBool = true)}
          on:load={() => (loading = false)}
          in:fade
        />
      {/key}
      {#if loading}
        <img src={loadingFailure} alt={name} class="thumbnail" in:fade />
      {/if}
      {#if episode}
        <p class="episode">Episode {episode}</p>
      {/if}
      <div class="info">
        <div class="text">
          <h1>
            {name ?? "Loading"}
            {#if media?.isAdult}
              <span class="nsfw">18+</span>
            {/if}
          </h1>
          {#if airingAt}
            <p class="time">
              <!-- Inverse so that -1 % 7 = 6 instead of -1 -->
              {#if airingTime.getDay() === (today.getDay() + 6) % 7}
                Yesterday
              {:else if airingTime.getDay() === today.getDay()}
                Today
              {:else if airingTime.getDay() === (today.getDay() + 1) % 7}
                Tomorrow
              {:else}
                {airingTime.toLocaleString("en-US", {
                  weekday: "long",
                })}
              {/if}
              at {airingTime.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          {/if}
          <p class="description">
            {@html DOMPurify.sanitize(media?.description ?? "", {
              USE_PROFILES: { html: true },
            })}
          </p>
        </div>
      </div>
    </span>
  </a>
</body>

<style>
  body {
    width: auto;
    display: inline-flex;
    vertical-align: top;
    margin-left: 15px;
    margin-right: 15px;

    /* I'm just gonna use overflow-y because line clamping slows down the loading of the page by a few seconds and that's not fun for the user */
    overflow-y: hidden;
    text-overflow: ellipsis;
    border-radius: 12px;

    transition: transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  }

  .unselectable {
    pointer-events: none;
  }

  body a {
    text-decoration: none;
  }

  body img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /* Might be too much but just to make sure that it works in every case */
    min-width: 178px;
    min-height: 252px;
    width: 178px;
    height: 252px;
    max-width: 178px;
    max-height: 252px;
  }

  body:is(:hover, :focus-within) {
    transform: translateY(-2px);
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.8);
  }

  body a:hover .episode {
    background-color: rgba(var(--primary-rgb), 0.3);
  }

  a {
    text-decoration: none;
    color: var(--text-color);
  }

  h1 {
    display: inline-flex;
    font-size: 1em;
    margin: 0;
    margin-left: 1em;
    margin-right: 1em;
    padding-bottom: 0;
    height: auto;
    width: 85%;
    justify-content: space-between;
  }

  h1 .nsfw {
    color: var(--danger-color);
    padding-top: 0.1em;
    font-weight: bold;
    font-size: smaller;
    margin-left: 0.5em;
  }

  p {
    font-size: 1em;
    margin: 0;
    margin-left: 1em;
    margin-top: 1em;
    height: auto;
    font-weight: 100;
    padding-right: 1em;
  }

  .holder {
    max-width: 450px;
    width: 100%;
    min-width: 160px;
    display: flex;
    border-radius: 12px;
    background-color: var(--secondary-color);
  }

  .info {
    overflow: hidden;
    width: 0;
    height: 100%;
    padding-top: 10px;
    padding-bottom: 20px;
    height: 222px;
    transition: width 0.5s ease-in-out;
  }

  body:hover .info {
    transition: width 0.5s ease-in-out 0.5s;
    width: 400px;
  }

  body.expanded .info {
    width: 400px;
  }

  body.expanded .text {
    opacity: 1;
  }

  body:focus-within .info {
    transition: width 0.5s ease-in-out;
    width: 400px;
  }

  .text {
    color: var(--text-color);
    margin-bottom: 1em;
    word-wrap: break-word;
    white-space: normal;
    hyphens: auto;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  body:hover .text {
    transition: opacity 0.3s ease-out 0.8s;
    opacity: 1;
  }

  body:focus-within .text {
    transition: opacity 0.3s ease-out 0.4s;
    opacity: 1;
  }

  .hide {
    display: none;
  }

  .episode {
    margin: 0;
    padding: 0.5rem 1rem;
    text-align: center;
    /* Width, left, and bottom are shit to work with idk how to do it another way */
    width: 134px;
    left: 0.5rem; /* play around with this */
    position: absolute;
    bottom: 0.5rem; /* and play around with this */
    background-color: rgba(var(--primary-rgb), 0.6);
    border-radius: 8px;
    font-size: smaller;
    font-weight: bold;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);

    transition: background-color 0.2s ease-in-out;
  }

  .description {
    color: rgba(var(--text-rgb), 0.7);
  }

  .time {
    font-style: italic;
    font-weight: 300;
    opacity: 0.8;
  }
</style>
