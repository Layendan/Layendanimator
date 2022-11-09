<script lang="ts">
  import { goto, prefetch } from "$app/navigation";
  import type { Anime } from "$lib/model/anime";
  import { onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import Button from "../public/Button.svelte";

  export let source: string;
  export let medias: Anime[];

  const rotateLeft = () => {
    const transitioningImage = medias[medias.length - 1];
    const element = document.getElementById(transitioningImage.id);
    if (element) {
      element.style.opacity = "0";
      medias = [
        medias[medias.length - 1],
        ...medias.slice(0, medias.length - 1),
      ];
      setTimeout(() => (element.style.opacity = "1"), 1000);
    }
  };

  const rotateRight = () => {
    const transitioningImage = medias[0];
    const element = document.getElementById(transitioningImage.id);
    if (element) {
      element.style.opacity = "0";
      medias = [...medias.slice(1, medias.length), medias[0]];
      setTimeout(() => (element.style.opacity = "1"), 1000);
    }
  };

  let interval = setInterval(rotateRight, 10000);

  onDestroy(() => clearInterval(interval));
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.metaKey || event.ctrlKey) return;

    if (event.key === "ArrowLeft") {
      rotateLeft();
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      rotateRight();
      event.preventDefault();
    }
  }}
/>

<div id="carousel-container">
  <div id="carousel-images" class:even={medias.length % 2 === 0}>
    {#each medias as media (media.id)}
      <div
        class="carousel-image"
        id={media.id}
        in:fade
        animate:flip={{ duration: 1000 }}
      >
        <img src={media.bannerImage} alt={media.title.romaji} />
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
            <p>{@html media.description.replaceAll(/(<br>|<\/br>).*/g, "")}</p>
          {/if}
          <Button
            size="fitContent"
            on:click={() => goto(`/${source}/${media?.id}`)}
            on:mouseenter={() => {
              prefetch(`/${source}/${media?.id}`);
              clearInterval(interval);
            }}
            on:mouseleave={() => {
              clearInterval(interval);
              interval = setInterval(rotateRight, 10000);
            }}><h2>Watch Now</h2></Button
          >
        </div>
      </div>
    {/each}
  </div>
  <button
    class="left"
    on:click={rotateLeft}
    on:mouseenter={() => clearInterval(interval)}
    on:mouseleave={() => {
      clearInterval(interval);
      interval = setInterval(rotateRight, 10000);
    }}
    ><svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      stroke="#ffffff"
      fill="#ffffff"
      viewBox="0 0 25.451 25.451"
      style="enable-background:new 0 0 25.451 25.451;"
      ><g id="c185_triangle">
        <path
          d="M20.982,0.521v2.006L8.57,12.315c-0.121,0.101-0.195,0.251-0.195,0.41s0.074,0.311,0.195,0.41l12.412,9.79v2.005
			c0,0.199-0.115,0.383-0.297,0.469c-0.178,0.086-0.395,0.064-0.549-0.061L4.664,13.136c-0.122-0.1-0.194-0.251-0.194-0.41
			s0.072-0.31,0.194-0.41L20.136,0.113c0.154-0.126,0.371-0.148,0.549-0.061C20.866,0.139,20.982,0.322,20.982,0.521z"
        />
      </g></svg
    ></button
  >
  <button
    class="right"
    on:click={rotateRight}
    on:mouseenter={() => clearInterval(interval)}
    on:mouseleave={() => {
      clearInterval(interval);
      interval = setInterval(rotateRight, 10000);
    }}
    ><svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      stroke="#ffffff"
      fill="#ffffff"
      viewBox="0 0 25.451 25.451"
      style="enable-background:new 0 0 25.451 25.451; transform: rotate(180deg);"
      ><g id="c185_triangle">
        <path
          d="M20.982,0.521v2.006L8.57,12.315c-0.121,0.101-0.195,0.251-0.195,0.41s0.074,0.311,0.195,0.41l12.412,9.79v2.005
			c0,0.199-0.115,0.383-0.297,0.469c-0.178,0.086-0.395,0.064-0.549-0.061L4.664,13.136c-0.122-0.1-0.194-0.251-0.194-0.41
			s0.072-0.31,0.194-0.41L20.136,0.113c0.154-0.126,0.371-0.148,0.549-0.061C20.866,0.139,20.982,0.322,20.982,0.521z"
        />
      </g></svg
    ></button
  >
</div>

<style>
  #carousel-container {
    width: 100vw;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  #carousel-images {
    display: inline-flex;
    justify-content: center;
    flex-wrap: nowrap;
  }

  .even {
    transform: translateX(-50%);
  }

  .carousel-image {
    display: inline-flex;
    position: relative;
    width: 98vw;
    height: 60vh;
    gap: 1rem;
    flex-shrink: 0;
    margin: 1rem 1vw;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .carousel-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 8px;
  }

  .text {
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 1rem;
    padding-right: 5rem;
    width: 100%;
    height: 100%;
    max-width: 35vw;
    display: flex;
    width: auto;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.9) 35%,
      rgba(0, 0, 0, 0.5) 80%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .text h1 {
    font-size: 3rem;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  .text p {
    color: var(--secondary-text-color);
    margin: 0.5rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  .text p.secondary {
    margin: 0 0.5rem;
  }

  .text h2 {
    margin: 0.2rem 1rem;
  }

  button {
    position: absolute;
    display: block;
    bottom: 5%;
    background: transparent;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    font-weight: bold;
    border: none;
    cursor: pointer;
    z-index: 1;
  }

  button.left {
    left: 2rem;
  }

  button.right {
    right: 2rem;
  }

  #Capa_1 {
    border-radius: 50%;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.4);
    padding: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
</style>
