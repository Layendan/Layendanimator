<script lang="ts">
  import type { ActiveSource } from "$lib/model/sources";
  import { fade } from "svelte/transition";

  export let id: string;
  export let title: string;
  export let description: string = "";
  export let thumbnail: string;
  export let ratings: number = 0;
  // export let tags: { name: string }[] = [];
  export let genres: Array<string> = [];
  export let isNSFW: boolean = false;
  export let source: ActiveSource | null = null;
</script>

<li>
  <a href="/{source?.id}/{id}" on:click>
    <div class="container">
      <img
        src={thumbnail ?? "/assets/loading_failure.jpeg"}
        alt={title}
        loading="lazy"
        in:fade
      />
      <div class="text">
        <h1>
          {title}
          {#if isNSFW}
            <span class="nsfw">18+</span>
          {/if}
        </h1>
        <p class="description">
          {@html description ?? ""}
        </p>
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
    background: url("/assets/loading_failure.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
