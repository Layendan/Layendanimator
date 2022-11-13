<script lang="ts">
  import { goto, prefetch } from "$app/navigation";
  import type { Anime } from "$lib/model/anime";
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import Button from "../public/Button.svelte";

  export let source: string;
  export let medias: Anime[];

  // Start at first item since 0 is the last for looping around
  let index: number = 1;
  let innerWidth: number;
  let duration: number = 0;
  const transitionTime: number = 0.5;

  let hovered: boolean = false;
  let dragStart: number | null = null;

  function next() {
    if (index === medias.length) index = 0;
    setTimeout(() => {
      duration = transitionTime;
      index++;
      setTimeout(() => {
        duration = 0;
      }, transitionTime * 1000);
    }, 1);
  }

  function prev() {
    if (index === 0) index = medias.length;
    setTimeout(() => {
      duration = transitionTime;
      index--;
      setTimeout(() => {
        duration = 0;
      }, transitionTime * 1000);
    }, 1);
  }

  let interval = setInterval(() => {
    if (!hovered) next();
  }, 10000);
  onDestroy(() => clearInterval(interval));
</script>

<svelte:window
  bind:innerWidth
  on:keydown={(e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case "ArrowLeft":
        prev();
        e.preventDefault();
        break;
      case "ArrowRight":
        next();
        e.preventDefault();
        break;
    }
  }}
/>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="carousel__container"
  style="cursor: {dragStart === null ? "grab" : "grabbing"}"
  draggable="true"
  in:fade
  on:mousedown={(e) => {
    if (e.button !== 0) return;
    dragStart = e.x;
    hovered = true;
    console.log(dragStart);
    e.preventDefault();
  }}
  on:mousemove={(e) => {
    if (dragStart === null) return;
    index = index - (e.x - dragStart) / innerWidth;
    dragStart = e.x;
    e.preventDefault();
  }}
  on:mouseup={(e) => {
    if (dragStart === null) return;
    duration = transitionTime;
    index = Math.round(index);
    dragStart = null;
    setTimeout(() => {
      duration = 0;
    }, transitionTime * 1000);
    hovered = false;
    e.preventDefault();
  }}
  on:mouseleave={(e) => {
    if (dragStart === null) return;
    duration = transitionTime;
    index = Math.round(index);
    dragStart = null;
    setTimeout(() => {
      duration = 0;
    }, transitionTime * 1000);
    hovered = false;
    e.preventDefault();
  }}
>
  <div
    class="slider__container"
    style="transition-duration: {duration}s; transform: translate3d(-{index *
      innerWidth}px, 0, 0);"
  >
    <!-- Last Item -->
    <div class="carousel__item" style="width: {innerWidth}px;">
      <img
        src={medias[medias.length - 1].bannerImage}
        alt={medias[medias.length - 1].title.english ??
          medias[medias.length - 1].title.native}
      />
      <div class="overlay" />
      <div class="text">
        <h1>
          {medias[medias.length - 1].title.english ??
            medias[medias.length - 1].title.romaji}
        </h1>
        <p class="secondary">
          <b>
            {#if medias[medias.length - 1].rating}
              Score: [{medias[medias.length - 1].rating}]<br />
            {/if}
            {#if medias[medias.length - 1].releaseDate}
              {medias[medias.length - 1].releaseDate} -
            {/if}
            {medias[medias.length - 1].status}
          </b>
        </p>
        {#if medias[medias.length - 1].description}
          <p>
            {@html medias[medias.length - 1].description.replaceAll(
              /(<\/?br>).*/g,
              ""
            )}
          </p>
        {/if}
        <Button
          size="fitContent"
          on:click={() => goto(`/${source}/${medias[medias.length - 1]?.id}`)}
          on:mouseenter={() => {
            prefetch(`/${source}/${medias[medias.length - 1]?.id}`);
          }}
        >
          <h2>Watch Now</h2>
        </Button>
      </div>
    </div>

    {#each medias as media}
      <div class="carousel__item" style="width: {innerWidth}px;">
        <img
          src={media.bannerImage}
          alt={media.title.english ?? media.title.native}
        />
        <div class="overlay" />
        <div class="text">
          <h1>{media.title.english ?? media.title.romaji}</h1>
          <p class="secondary">
            <b>
              {#if media.rating}
                Score: [{media.rating}]<br />
              {/if}
              {#if media.releaseDate}
                {media.releaseDate} -
              {/if}
              {media.status}
            </b>
          </p>
          {#if media.description}
            <p>{@html media.description.replaceAll(/(<\/?br>).*/g, "")}</p>
          {/if}
          <Button
            size="fitContent"
            on:click={() => goto(`/${source}/${media?.id}`)}
            on:mouseenter={() => {
              prefetch(`/${source}/${media?.id}`);
            }}
          >
            <h2>Watch Now</h2>
          </Button>
        </div>
      </div>
    {/each}

    <!-- First Item -->
    <div class="carousel__item" style="width: {innerWidth}px;">
      <img
        src={medias[0].bannerImage}
        alt={medias[0].title.english ?? medias[0].title.native}
      />
      <div class="overlay" />
      <div class="text">
        <h1>{medias[0].title.english ?? medias[0].title.romaji}</h1>
        <p class="secondary">
          <b>
            {#if medias[0].rating}
              Score: [{medias[0].rating}]<br />
            {/if}
            {#if medias[0].releaseDate}
              {medias[0].releaseDate} -
            {/if}
            {medias[0].status}
          </b>
        </p>
        {#if medias[0].description}
          <p>{@html medias[0].description.replaceAll(/(<\/?br>).*/g, "")}</p>
        {/if}
        <Button
          size="fitContent"
          on:click={() => goto(`/${source}/${medias[0]?.id}`)}
          on:mouseover={() => {
            prefetch(`/${source}/${medias[0]?.id}`);
            hovered = true;
          }}
          on:mouseleave={() => (hovered = false)}
        >
          <h2>Watch Now</h2>
        </Button>
      </div>
    </div>
  </div>

  <!-- Button Container -->
  <div class="buttons__container">
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <button
      class="button"
      on:mouseover={() => (hovered = true)}
      on:mouseout={() => (hovered = false)}
      on:click={prev}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-left"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <button
      class="button"
      on:mouseover={() => (hovered = true)}
      on:mouseout={() => (hovered = false)}
      on:click={next}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-right"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</div>

<style>
  .carousel__container {
    overflow: hidden;
    z-index: 1;
    position: relative;
    display: block;
    height: 70vh;
    width: 100%;
    user-select: none;
  }

  .buttons__container {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    padding-right: 2rem;
    padding-bottom: 3rem;
    z-index: 2;
  }

  .buttons__container .button {
    background: rgba(var(--primary-rgb), 0.1);
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
    z-index: 4;
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    transition: 0.2s;
  }

  .buttons__container .button:hover {
    background: rgba(var(--primary-rgb), 0.5);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  .slider__container {
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    right: 0;
    bottom: 0;
    transition: transform 0s ease-in-out;
  }

  .carousel__item {
    height: 100%;
    display: block;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    transform-style: preserve-3d;
    transition: width 0s ease;
  }

  .carousel__item img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
  }

  .carousel__item .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to right,
        rgba(var(--primary-rgb), 0.8) 0%,
        rgba(var(--primary-rgb), 0) 2%,
        rgba(var(--primary-rgb), 0) 98%,
        rgba(var(--primary-rgb), 0.8) 100%
      ),
      linear-gradient(
        to bottom,
        rgba(var(--primary-rgb), 1) 0%,
        rgba(var(--primary-rgb), 0) 10%,
        rgba(var(--primary-rgb), 0) 90%,
        rgba(var(--primary-rgb), 1) 100%
      ),
      radial-gradient(
        ellipse at 80%,
        rgba(var(--primary-rgb), 0) 0%,
        rgba(var(--primary-rgb), 0.7) 50%,
        rgba(var(--primary-rgb), 1) 95%
      );
  }

  .carousel__item .text {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 45%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding-left: 2rem;
    padding-bottom: 3rem;
  }

  * {
    user-select: none;
  }

  .carousel__item .text h1 {
    font-size: 3rem;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .carousel__item .text p {
    color: var(--secondary-text-color);
    margin-top: 0;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }

  .carousel__item .text p.secondary {
    margin: 0.5rem 0;
  }

  .carousel__item .text h2 {
    margin: 0.2rem 1rem;
  }
</style>
