<script lang="ts">
  import loadingFailure from "$lib/components/assets/loading_failure.jpeg";
  import DOMPurify from "dompurify";

  export let title: string;
  export let link: string;
  export let description: string = "";
  export let thumbnail: string = loadingFailure;
  export let banner: string = loadingFailure;
  export let ratings: number = 0;
  // export let tags: Array<any> = [];
  export let genres: Array<string> = [];
  export let isNSFW: boolean = false;
</script>

<li>
  <a
    href="/player?link={link}&name={title}&thumbnail={thumbnail}&banner={banner}&description={description}"
  >
    <div class="container">
      <img
        on:error={() => (thumbnail = loadingFailure)}
        src={thumbnail}
        alt={title}
      />
      <div class="text">
        <h1>
          {title}
          {#if isNSFW}
            <span class="nsfw">18+</span>
          {/if}
        </h1>
        <p class="description">{@html DOMPurify.sanitize(description)}</p>
        <p>{ratings ? `${ratings}%` : ""}</p>
        {#if genres.length !== 0}
          <ul class="genres">
            {#each genres as genre}
              <li>{genre}</li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </a>
</li>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: left;
    width: 100%;
    height: 100%;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    margin-right: 2rem;
  }

  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow-y: hidden;
    -webkit-line-clamp: 1;
  }

  h1 .nsfw {
    color: var(--danger-color);
    padding-top: 0.1em;
    font-weight: bold;
    font-size: smaller;
    margin-left: 0.5em;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
  li {
    display: block;
    font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  img {
    height: 345px;
    aspect-ratio: 2/3;
    margin-left: 2rem;
    margin-right: 2rem;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
</style>
