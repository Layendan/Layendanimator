<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;
  let scrollY: number = 0;
</script>

<svelte:window bind:scrollY />

<header class="relative m-[-1rem] mb-4 z-0" style="top: {scrollY / 1.5}px;">
  <div
    class="absolute inset-0 bg-gradient-to-b from-transparent to-base-100 pointer-events-none"
  />
  <img
    class="w-full h-[38vh] object-cover object-top"
    src={data.cover ?? data.image}
    alt="{data.title.english ?? data.title.romaji} Cover"
  />
</header>

<section in:fade class="relative block p-4">
  <div
    class="grid gap-x-4 grid-cols-[240px_auto] lg:grid-cols-[300px_auto] grid-rows-1 mx-auto"
  >
    <div class="relative m-0 mt-[-20vh]">
      <img
        src={data.image}
        alt={data.title.english ?? data.title.romaji}
        class="w-max object-cover rounded-lg"
      />
      <button class="btn btn-primary w-full my-4">Add to List</button>
    </div>
    <div
      class="relative block w-auto h-min p-4 card bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-80 ring-[var(--anime-color)] transition-shadow duration-300"
      class:hover:ring={data.color}
      style:--anime-color={data.color ?? 'var(--accent-color)'}
    >
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        {data.title.english ?? data.title.romaji}
      </h1>
      <p class="block w-fit h-min">{@html data.description}</p>
    </div>
  </div>
</section>

<div class="divider relative" />

<div class="relative prose pt-4">
  <ul>
    {#each data.episodes as episode}
      <li>
        <a href="/{data.id}/{episode.id}"
          >{episode.title ?? `Episode ${episode.number}`}</a
        >
      </li>
    {/each}
  </ul>
</div>
