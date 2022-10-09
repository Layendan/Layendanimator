<script lang="ts">
  import type { Anime } from "$lib/model/anime";
  import { fade, slide } from "svelte/transition";
  // @ts-ignore
  import ColorThief from "colorthief";

  export let media: Anime;
  export let source: string | null = null;
  export let delay: number = 0;

  let color: string = "0, 0, 0";
  let hovering: boolean = false;
  let focused: boolean = false;

  function isDark(r: number, g: number, b: number) {
    const yiq: number = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq <= 128;
  }
</script>

<a
  class="card"
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  on:focusin={() => (focused = true)}
  on:focusout={() => (focused = false)}
  in:fade={{ delay }}
  href={source ? `/${source}/${media?.id}` : `/${media?.id}`}
  class:unselectable={!media || !media?.id}
  data-sveltekit-prefetch
  on:click
  style:--color={color}
>
  <div class="card__image">
    <img
      src={media.coverImage.large}
      alt={media.title.romaji}
      on:load={() => {
        const colorThief = new ColorThief();
        const img = new Image();

        img.addEventListener("load", () => {
          const colors = colorThief.getPalette(img, 5);
          const [r, g, b] = colors[0];
          let isDarkColor = false;
          do {
            const [r, g, b] = colors.shift();
            isDarkColor = isDark(r, g, b);
            color = `${r}, ${g}, ${b}`;
          } while (!isDarkColor && colors.length > 0);
          // In case none of the colors are dark, use the first one
          if (!isDarkColor) {
            color = `${r}, ${g}, ${b}`;
          }
        });
        // TODO: Have to load image using proxy to avoid CORS issues
        let googleProxyURL =
          "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=";

        img.crossOrigin = "Anonymous";
        img.src = googleProxyURL + encodeURIComponent(media.coverImage.large);
      }}
    />
  </div>
  <div class="card_overlay" />
  <div class="card_gradient" />
  <div class="card__content" style:--text-color="#ffffff">
    <h2 class="card__title">{media.title.romaji ?? media.title.english}</h2>
    {#if (hovering || focused) && media.description}
      <p class="card__description" transition:slide|local={{ duration: 500 }}>
        {media.description}
      </p>
    {/if}
  </div>
</a>

<style>
  .card {
    background-color: var(--secondary-color);
    border-radius: 12px;
    margin: 15px;
    display: inline-flex;
    flex-direction: column;
    height: clamp(325px, 50vh, 50vh);
    aspect-ratio: 5/8;
    overflow: visible;
    position: relative;
    outline: none;
  }

  .card::before {
    content: "";
    position: absolute;
    top: -8px;
    bottom: -8px;
    left: -8px;
    right: -8px;
    border: 4px solid rgba(var(--color), 0);
    border-radius: 20px;
    transition: border 0.2s ease-in-out;
  }

  .card:matches(:hover, :focus)::before {
    border: 4px solid rgba(var(--color), 1);
  }

  .card__image {
    position: relative;
    border-radius: 12px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    isolation: isolate;
    border-radius: 12px;
  }

  .card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 12px;
  }

  .card_overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(var(--primary-rgb), 0);
    border-radius: 12px;
    transition: background-color 500ms ease-in-out;
  }

  .card:matches(:hover, :focus) .card_overlay {
    background-color: rgba(var(--primary-rgb), 0.3);
  }

  .card_gradient {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(var(--color), 0) 45%,
      rgba(var(--color), 0.5) 50%,
      rgba(var(--color), 1) 100%
    );
    border-radius: 12px;
  }

  .card__content {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 1rem;
    color: var(--text-color);
  }

  .card__title {
    font-size: 1.5rem;
    margin: 0;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
  }

  .card__description {
    font-size: 1rem;
    margin: 0;
    margin-top: 0.5rem;
    font-weight: 100;
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
  }

  .unselectable {
    pointer-events: none;
  }
</style>
