<script lang="ts">
  // Import required packages
  import loadingFailure from "$lib/components/loading_failure.jpeg";
  import { fade } from "svelte/transition";
  import DOMPurify from "dompurify";

  // Export component definitions
  export let name: string = undefined;
  export let link: string = null;
  export let thumbnail: string = loadingFailure;
  export let banner: string = loadingFailure;
  export let description: string = "unavailable";
  export let episodes: Array<any> = null;
  export let isNSFW: boolean = false;

  // Check if there is data to store before looking at the length or else returns null error
  const DATA_NAME = name + "-episodes";
  if (
    episodes &&
    episodes.length > 0 &&
    !window.sessionStorage.getItem(DATA_NAME)
  ) {
    window.sessionStorage.setItem(DATA_NAME, JSON.stringify(episodes));
  }

  // Instance variables for line clamping
  // Default 9 lines to clamp, but can be changed to be more or less
  // let pHeight = 0;
  // let titleHeight = 0;
  // let linesToClamp = 9;

  // Clamps the lines of the description until it fits within the given height
  // 220 is the height of the description + title text
  // 20 is for padding - can be changed
  // From: https://stackoverflow.com/questions/11856136/is-css3-line-clamp-possible-in-javascript
  // function clamp(pHeight) {
  //   if (pHeight > 220 - titleHeight - 20 && linesToClamp >= 1) {
  //     linesToClamp--;
  //   }
  // }

  // Removing line clamp as it lags page A LOT as it loads
  // Making it a function so that it only calls it with pHeight changes
  // $: clamp(pHeight);
</script>

<svelte:head>
  <!-- Preloads loading failure so that it looks nice when loading page -->
  <link rel="preload" as="image" href={loadingFailure} />
</svelte:head>

<body transition:fade>
  <a
    href="/player?link={link}&name={name}&thumbnail={thumbnail}&banner={banner}&description={description}"
    class:unselectable={link == null}
  >
    <span class="holder">
      <img
        on:error={() => (thumbnail = loadingFailure)}
        src={thumbnail}
        loading="lazy"
        alt={name}
      />
      <div class="info">
        <div class="text">
          <!-- <h1
              class="line-clamp"
              bind:clientHeight={titleHeight}
              style="-webkit-line-clamp: 5;"
            > -->
          <h1>
            {name}
            {#if isNSFW}
              <span class="nsfw">18+</span>
            {/if}
          </h1>
          <p>
            <!-- <p
                class="line-clamp"
                bind:clientHeight={pHeight}
                style="-webkit-line-clamp: {linesToClamp};"
              > -->
            {@html DOMPurify.sanitize(description)}
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
  }

  a:focus > .holder {
    border-color: var(--accent-color);
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
    width: 160px;
    border-radius: 10px 0 0 10px;
    aspect-ratio: 46/65;

    transition: filter 0.2s ease-in-out;
  }

  body a:hover img {
    filter: brightness(115%);
  }
  body a:hover .text {
    transform: translateY(-1px);
  }
  body a:hover .info {
    background-color: var(--tertiary-color);
  }

  body a:hover .holder {
    border-color: var(--pure-white);
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
    word-wrap: break-word;
    white-space: normal;
    hyphens: auto;
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
    word-wrap: break-word;
    white-space: normal;
    hyphens: auto;
    font-weight: 100;
    padding-right: 1em;
  }

  .holder {
    max-width: 450px;
    width: 400px;
    min-width: 160px;
    display: flex;
    border-radius: 12px;
    border-color: var(--tertiary-color);
    border-style: solid;
    border-width: 2px;
    background-color: var(--secondary-color);

    transition: border-color 0.2s ease-in-out;
  }

  .info {
    width: 100%;
    height: 100%;
    border-radius: 0 10px 10px 0;
    padding-top: 10px;
    padding-bottom: 20px;
    height: 222px;
    /* overflow-y: scroll; */

    transition: background-color 0.2s ease-in-out;
  }

  .text {
    transition: transform 0.2s ease-in-out;
    color: var(--text-color);
    margin-bottom: 1em;
    /* overflow-y: scroll; */
  }

  /* .line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow-y: hidden;
  } */
</style>
