<script lang="ts">
  // Import required packages
  import loadingFailure from "$lib/components/loading_failure.jpeg";

  // Export component definitions
  export let name: string = undefined;
  export let link: string = null;
  export let thumbnail: string = loadingFailure;
  export let banner: string = loadingFailure;
  export let description: string = "unavailable";
  export let episodes: Array<any> = null;

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
  let pHeight = 0;
  let titleHeight = 0;
  let linesToClamp = 9;

  // Clamps the lines of the description until it fits within the given height
  // 220 is the height of the description + title text
  // 20 is for padding - can be changed
  // From: https://stackoverflow.com/questions/11856136/is-css3-line-clamp-possible-in-javascript
  function clamp(pHeight) {
    if (pHeight > 220 - titleHeight - 20 && linesToClamp >= 1) {
      linesToClamp--;
    }
  }

  // Removing line clamp as it lags page A LOT as it loads
  // Making it a function so that it only calls it with pHeight changes
  // $: clamp(pHeight);
</script>

<svelte:head>
  <!-- Preloads loading failure so that it looks nice when loading page -->
  <link rel="preload" as="image" href={loadingFailure} />
</svelte:head>

<main>
  <body>
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
            </h1>
            <div>
              <p>
                <!-- <p
                class="line-clamp"
                bind:clientHeight={pHeight}
                style="-webkit-line-clamp: {linesToClamp};"
              > -->
                {@html description}
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

    /* I'm just gonna use overflow-y because line clamping slows down the loading of the page by a few seconds and that's not fun for the user */
    overflow-y: hidden;
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
    padding-right: 1em;
  }

  .holder {
    max-width: 400px;
    width: 400px;
    min-width: 160px;
    display: flex;
    border-radius: 12px;
    border-color: gray;
    border-style: solid;
    border-width: 2px;
    background-color: rgb(30, 30, 30);
  }

  .info {
    width: 100%;
    height: 100%;
    border-radius: 0 10px 10px 0;
    padding-top: 10px;
    height: 222px;

    transition: background-color 0.2s ease-in-out;
  }

  .text {
    transition: transform 0.2s ease-in-out;
    color: white;
    margin-bottom: 1em;
    overflow-y: hidden;
  }

  /* .line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow-y: hidden;
  } */
</style>
