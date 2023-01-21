<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import UpArrow from '$lib/components/svg/UpArrow.svelte';
  import DownArrow from '$lib/components/svg/DownArrow.svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import type { Episode } from '$lib/model/Anime';
  import { subscriptions } from '$lib/model/subscriptions';

  export let data: PageData;
  const watchPercentage = 0.8;
  let scrollY = 0;
  let descriptionCollapsed = true;
  let isAscending = true;
  let showWatched = true;
  $: sortedEpisodes = sortEpisodes(data.anime.episodes, isAscending);

  const lastEpisodeWatched = data.anime.episodes.findLast(
    e => (data.store[e.id]?.watched ?? 0) > 0
  );

  function sortEpisodes(episodes: Episode[], isAscending: boolean): Episode[] {
    if (isAscending) {
      return episodes.sort((a, b) => a.number - b.number);
    } else {
      return episodes.sort((a, b) => b.number - a.number);
    }
  }
</script>

<svelte:window bind:scrollY />

<header class="relative m-[-1rem] mb-4 z-0" style="top: {scrollY / 1.5}px;">
  <div
    class="absolute inset-0 bg-gradient-to-b from-transparent to-base-100 pointer-events-none"
  />
  <img
    class="w-full h-[38vh] object-cover object-top"
    src={data.anime.cover ?? data.anime.image}
    alt="{data.anime.title.english ?? data.anime.title.romaji} Cover"
  />
</header>

<section in:fade class="relative block px-4">
  <div
    class="grid gap-x-4 grid-cols-[240px_auto] lg:grid-cols-[300px_auto] grid-rows-1 mx-auto"
  >
    <div class="relative m-0 mt-[-20vh]">
      <a
        href="https://anilist.co/anime/{data.anime.id}"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={data.anime.image}
          alt={data.anime.title.english ?? data.anime.title.romaji}
          class="w-full object-cover rounded-lg hover:ring ring-[var(--anime-color)] transition-shadow duration-300"
          style:--anime-color={data.anime.color ?? 'var(--accent-color)'}
        />
      </a>
      <button
        class="btn btn-primary w-full mt-4"
        class:btn-error={$subscriptions.some(s => s.id === data.anime.id)}
        class:btn-outline={$subscriptions.some(s => s.id === data.anime.id)}
        on:click={() => {
          if ($subscriptions.some(s => s.id === data.anime.id)) {
            subscriptions.remove(data.anime);
          } else {
            subscriptions.add(data.anime);
          }
        }}
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
          {#if $subscriptions.some(s => s.id === data.anime.id)}
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
        {data.anime.title.english ?? data.anime.title.romaji}
      </h1>
      <ul class="flex flex-wrap gap-1 mb-4">
        <div class="badge badge-accent badge-outline">
          {data.anime.type.replaceAll('_', ' ')}
        </div>
        {#if data.anime.isAdult}
          <div class="badge badge-error badge-outline">18+</div>
        {/if}
        <div class="badge badge-accent badge-outline">{data.anime.status}</div>
        {#each data.anime.genres as genre}
          <div class="badge badge-accent badge-outline">{genre}</div>
        {/each}
        {#if data.anime.rating}
          <div
            class="badge badge-outline"
            class:badge-error={data.anime.rating <= 40}
            class:badge-warning={data.anime.rating > 40 &&
              data.anime.rating <= 75}
            class:badge-success={data.anime.rating > 75}
          >
            {data.anime.rating}%
          </div>
        {/if}
      </ul>
      <p
        class="w-fit h-min"
        class:line-clamp-[3]={descriptionCollapsed}
        class:lg:line-clamp-[6]={descriptionCollapsed}
      >
        {@html data.anime.description}
      </p>
      <br />
      <p
        class="font-semibold cursor-pointer"
        on:click={e => {
          descriptionCollapsed = !descriptionCollapsed;
          if (descriptionCollapsed) {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
          e.stopPropagation();
        }}
      >
        Show {descriptionCollapsed ? 'more' : 'less'}
      </p>
    </div>
  </div>
</section>

<div class="divider relative" />

<!-- EPISODES -->
<ScrollCarousel bind:key={data.anime.episodes}>
  <div slot="header" class="flex justify-between">
    <div class="flex items-center gap-4 mb-4">
      <h1
        class="text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Episodes
      </h1>
      {#if data.anime.episodes.length > 0}
        <button
          class="btn btn-outline btn-accent w-fit"
          on:click={() =>
            goto(
              `/${data.anime.id}/${
                lastEpisodeWatched?.id ?? data.anime.episodes[0].id
              }`
            )}
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
          <!-- Check if not user has watched anime yet -->
          {lastEpisodeWatched ? 'Continue' : 'Start'} Watching
        </button>
      {/if}
    </div>
    {#if data.anime.episodes.length > 0}
      <div class="block dropdown dropdown-end">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <label tabindex="0" class="btn btn-outline btn-accent w-fit">
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
            class="feather feather-bar-chart"
          >
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="16" />
          </svg>
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          tabindex="0"
          class="dropdown-content z-10 p-2 mt-1 shadow bg-base-100 rounded-box w-52"
        >
          <li class="m-1">
            <button
              class="btn btn-outline btn-accent w-full flex flex-row gap-1 text-base-content items-center"
              disabled={isAscending}
              on:click={() => (isAscending = true)}
            >
              <UpArrow width={20} height={20} />
              Episode
            </button>
          </li>
          <li class="m-1">
            <button
              class="btn btn-outline btn-accent w-full flex flex-row gap-1 text-base-content items-center"
              disabled={!isAscending}
              on:click={() => (isAscending = false)}
            >
              <DownArrow width={20} height={20} />
              Episode
            </button>
          </li>
          <li class="m-1">
            <button
              class="btn btn-outline btn-accent w-full flex flex-row gap-2 text-base-content items-center"
              on:click={() => (showWatched = !showWatched)}
            >
              <input
                type="checkbox"
                checked={showWatched}
                class="checkbox checkbox-accent"
              />
              Show Watched
            </button>
          </li>
        </ul>
      </div>
    {/if}
  </div>

  <svelte:fragment slot="content">
    {#each sortedEpisodes as episode}
      {#if showWatched || (data.store[episode.id]?.watched ?? 0) < watchPercentage}
        <a
          in:fade|local
          href={data.store[episode.id]?.watched
            ? `/${data.anime.id}/${episode.id}?t=${
                data.store[episode.id].watched * data.store[episode.id].duration
              }`
            : `/${data.anime.id}/${episode.id}`}
          class="flex flex-col gap-2 w-[210px]"
        >
          <div
            class="relative bg-clip-content rounded-md m-0 p-0 card w-[210px] h-auto aspect-video bg-base-300 shadow-lg hover:translate-y-[-4px] transition-transform duration-300"
          >
            <img
              src={episode.image ?? 'loading_failure.jpeg'}
              alt={episode.title ?? `Episode ${episode.number}`}
              class="relative card-body m-0 p-0 w-full h-full aspect-video object-cover object-center rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-no-repeat bg-center"
            />
            <div class="relative mx-1">
              <div
                style="width: {(data.store[episode.id]?.watched ?? 0) * 100}%;"
                class="absolute bottom-1 left-0 right-0 h-1 bg-primary rounded-md"
              />
            </div>
          </div>
          <div
            class="flex flex-col gap-1 text-base-content text-opacity-80 group hover:text-opacity-100"
          >
            <h3
              style:--anime-color={data.anime.color}
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
      {/if}
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No Episodes Found
        </p>
      </div>
    {/each}
  </svelte:fragment>
</ScrollCarousel>

<div class="divider relative" />

<!-- RECOMMENDATIONS -->
<ScrollCarousel bind:key={data.anime.recommendations}>
  <svelte:fragment slot="title">Recommendations</svelte:fragment>
  <svelte:fragment slot="content">
    {#each data.anime.recommendations as anime}
      <AnimeCard {anime} />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No Recommendations
        </p>
      </div>
    {/each}
  </svelte:fragment>
</ScrollCarousel>

<div class="divider relative" />

<!-- RELATED -->
<ScrollCarousel bind:key={data.anime.relations}>
  <svelte:fragment slot="title">Related</svelte:fragment>
  <svelte:fragment slot="content">
    {#each data.anime.relations.filter(a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT') as anime}
      <AnimeCard {anime} />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No Related Animes Found
        </p>
      </div>
    {/each}
  </svelte:fragment>
</ScrollCarousel>
