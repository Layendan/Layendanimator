<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Carousel from '$lib/components/Carousel.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  let scrollY: number = 0;
</script>

<svelte:window bind:scrollY />

<header class="relative m-[-1rem] mb-8 z-0" style="top: {scrollY / 1.5}px;">
  <Carousel bind:animes={data.popular} />
</header>

<main class="relative w-full">
  <section
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none overscroll-x-contain"
  >
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Recent Episodes
    </h1>
    <div
      class="relative inline-flex overflow-x-scroll whitespace-nowrap w-auto gap-6 p-4 pb-6"
    >
      {#each data.recent as anime}
        <AnimeCard {anime} />
      {/each}
    </div>
  </section>
  <div class="divider" />
  <section
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none"
  >
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Popular Animes
    </h1>
    <div
      class="relative inline-flex overflow-x-scroll whitespace-nowrap w-auto gap-6 p-4 pb-6"
    >
      {#each data.popular as anime}
        <AnimeCard {anime} />
      {/each}
    </div>
  </section>
  <div class="divider" />
  <section
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none"
  >
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Trending Animes
    </h1>
    <div
      class="relative inline-flex overflow-x-scroll whitespace-nowrap w-auto gap-6 p-4 pb-6"
    >
      {#each data.trending as anime}
        <AnimeCard {anime} />
      {/each}
    </div>
  </section>
</main>
