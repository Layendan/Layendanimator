<script lang="ts">
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;
  let scrollY = 0;
  let descriptionCollapsed = true;
  let isSubscribed = false;
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
      <a
        href="https://anilist.co/anime/{data.id}"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={data.image}
          alt={data.title.english ?? data.title.romaji}
          class="w-full object-cover rounded-lg hover:ring ring-[var(--anime-color)] transition-shadow duration-300"
          style:--anime-color={data.color ?? 'var(--accent-color)'}
        />
      </a>
      <!-- TODO: Create subscription list and add functionality -->
      <button
        class="btn w-full btn-primary mt-4"
        class:btn-primary={!isSubscribed}
        class:btn-error={isSubscribed}
        class:btn-outline={isSubscribed}
        on:click={() => (isSubscribed = !isSubscribed)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mr-2"
        >
          <!-- TODO: Check to see if anime is added to subscription list -->
          {#if isSubscribed}
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          {:else}
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          {/if}
        </svg>
        Subscriptions
      </button>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="relative block w-auto h-min p-4 card bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-80 hover:bg-opacity-80 transition-colors duration-300"
      class:hover:bg-base-300={descriptionCollapsed}
      class:cursor-pointer={descriptionCollapsed}
      on:click={() => (descriptionCollapsed = false)}
    >
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        {data.title.english ?? data.title.romaji}
      </h1>
      <ul class="flex flex-wrap gap-1 mb-4">
        {#if data.isAdult}
          <div class="badge badge-error badge-outline">18+</div>
        {/if}
        <div class="badge badge-accent badge-outline">{data.status}</div>
        {#each data.genres as genre}
          <div class="badge badge-accent badge-outline">{genre}</div>
        {/each}
        {#if data.rating}
          <div
            class="badge badge-outline"
            class:badge-error={data.rating <= 40}
            class:badge-warning={data.rating > 40 && data.rating <= 75}
            class:badge-success={data.rating > 75}
          >
            {data.rating}%
          </div>
        {/if}
      </ul>
      <p
        class="w-fit h-min"
        class:line-clamp-[3]={descriptionCollapsed}
        class:lg:line-clamp-[6]={descriptionCollapsed}
      >
        {@html data.description}
      </p>
      <br />
      <p
        class="font-semibold cursor-pointer"
        on:click={e => {
          descriptionCollapsed = !descriptionCollapsed;
          e.stopPropagation();
        }}
      >
        Show {descriptionCollapsed ? 'more' : 'less'}
      </p>
    </div>
  </div>
</section>

<div class="divider relative" />

<ScrollCarousel>
  <div slot="header" class="flex items-center gap-4 mb-4">
    <h1
      class="text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Episodes
    </h1>
    <button
      class="btn btn-outline btn-accent w-fit"
      on:click={() => goto(`/${data.id}/${data.episodes[0].id}`)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mr-2"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
      Continue Watching
    </button>
  </div>

  <svelte:fragment slot="content">
    {#each data.episodes as episode}
      <a href="/{data.id}/{episode.id}" class="flex flex-col gap-2 w-[210px]">
        <div
          class="relative bg-clip-content rounded-md m-0 p-0 card w-[210px] h-auto aspect-video bg-base-300 shadow-lg hover:translate-y-[-4px] transition-transform duration-300"
        >
          <img
            src={episode.image ?? 'loading_failure.jpeg'}
            alt={episode.title ?? `Episode ${episode.number}`}
            class="relative card-body m-0 p-0 w-full h-full aspect-video object-cover object-center rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-no-repeat bg-center"
          />
        </div>
        <div
          class="flex flex-col gap-1 text-base-content text-opacity-80 group hover:text-opacity-100"
        >
          <h3
            style:--anime-color={data.color}
            class="text-md font-bold leading-tight whitespace-normal line-clamp-2 group-hover:text-[var(--anime-color)] transition-colors duration-300"
          >
            {episode.title ?? `Episode ${episode.number}`}
          </h3>
          {#if episode.title}
            <h2
              class="text-sm leading-none whitespace-normal transition-colors duration-300"
            >
              Episode {episode.number}
            </h2>
          {/if}
        </div>
      </a>
    {/each}
  </svelte:fragment>
</ScrollCarousel>
