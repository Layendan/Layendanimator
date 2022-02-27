<script lang="ts">
  // Import required packages
  import { fade } from "svelte/transition";
  import loadingFailure from "$lib/components/loading_failure.jpeg";

  // Export component definitions
  export let name: string = undefined;
  export let link: string = null;
  export let thumbnail: string = loadingFailure;
  export let banner: string = loadingFailure;
  export let description: string = "unavailable";
  export let episodes: Array<any> = null;

  // Check if there is data to store before looking at the length or else returns null error
  if (episodes && episodes.length > 0) {
    window.sessionStorage.setItem(name + "-episodes", JSON.stringify(episodes));
  }

  // Instance variables for line clamping
  // Default 9 lines to clamp, but can be changed to be more or less
  let pHeight = 0;
  let titleHeight = 0;
  let linesToClamp = 9;

  // Clamps the lines of the description until it fits within the given height
  // 220 is the height of the description + title text
  // 20 is for padding - can be changed
  // From: https://stackoverflow.com/questions/11856136/is-css3-line-clamp-possible-in-javascript
  $: if (pHeight > 220 - titleHeight - 20 && linesToClamp > 1) {
    linesToClamp -= 1;
  }
</script>

<svelte:head>
  <!-- Preloads loading failure so that it looks nice when loading page -->
  <link rel="preload" as="image" href={loadingFailure} />
</svelte:head>

<main transition:fade>
  <body>
    <a
      href="/player?link={link}&name={name}&thumbnail={thumbnail}&banner={banner}&description={description}"
      class:unselectable={link == null}
      title={name}
    >
      <span class="holder">
        <img
          on:error={() => (thumbnail = loadingFailure)}
          src={thumbnail}
          in:fade
          loading="lazy"
          alt={name}
        />
        <div class="info">
          <div class="text" in:fade={{ delay: 200 }}>
            <h1 bind:clientHeight={titleHeight}>{name}</h1>
            <div class="module">
              <p
                class="line-clamp"
                bind:clientHeight={pHeight}
                style="-webkit-line-clamp: {linesToClamp};"
              >
                {@html description.replaceAll("<br>", " ")}
              </p>
            </div>
          </div>
        </div>
      </span>
    </a>
  </body>
</main>

<style>
  main {
    display: inline-block;
    vertical-align: top;
    margin-left: 15px;
    margin-right: 15px;
  }

  .unselectable {
    pointer-events: none;
  }

  main a {
    text-decoration: none;
  }

  main img {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 160px;
    max-width: 160px;
    min-width: 160px;
    border-radius: 10px 0 0 10px;
    aspect-ratio: 46/65;

    transition: filter 0.2s ease-in-out;
  }

  main a:hover img {
    filter: brightness(115%);
  }
  main a:hover .text {
    transform: translateY(-1px);
  }
  main a:hover .info {
    background-color: rgb(40, 40, 40);
  }

  a {
    text-decoration: none;
    color: white;
  }

  h1 {
    display: inline-flex;
    font-size: 1em;
    margin: 0;
    margin-left: 1em;
    margin-right: 1em;
    padding-bottom: 0;
    height: auto;
    word-wrap: break-word;
    white-space: normal;
    hyphens: auto;
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
    /* Breaks on safari */
    /* text-align: justify; */
    padding-right: 1em;
  }

  .holder {
    max-width: 400px;
    width: 400px;
    min-width: 160px;
    display: flex;
    border-radius: 10px;
    border-color: gray;
    border-style: solid;
    border-width: 2px;
    background-color: rgb(30, 30, 30);
    z-index: 2;
  }

  .info {
    width: 100%;
    height: 100%;
    border-radius: 0 10px 10px 0;
    padding-top: 10px;
    height: 226px;

    transition: background-color 0.2s ease-in-out;
  }

  .text {
    transition: transform 0.2s ease-in-out;
    color: white;
    height: min-content;
    margin-bottom: 1em;
    overflow-y: hidden;
  }

  .module {
    overflow-y: hidden;
    height: min-content;
  }

  .line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    height: min-content;
  }
</style>
