<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import CharacterCard from '$lib/components/CharacterCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { fade } from 'svelte/transition';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import type { PageData } from './$types';
  import Fa from 'svelte-fa';
  import {
    faArrowUp,
    faArrowDown,
    faFilter,
    faPlayCircle,
    faRotateRight
  } from '@fortawesome/free-solid-svg-icons';
  import { animeCache } from '$lib/model/cache';
  import { invalidate } from '$app/navigation';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import { watched } from '$lib/model/watch';

  export let data: PageData;
  let scrollY = 0;
  let descriptionCollapsed = true;
  let isAscending = true;
  let showWatched = true;
  let showImage: boolean;
  $: reversedEpisodes = [...data.anime.episodes].reverse();
  $: sortedEpisodes = isAscending ? data.anime.episodes : reversedEpisodes;
  $: relations = data.anime.relations.filter(
    a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT'
  );
  $: subscribed =
    $subscriptions.some(({ id }) => id === data.anime.id) ||
    $unwatchedSubscriptions.some(({ anime: { id } }) => id === data.anime.id);
  $: lastWatched = $watched[data.anime.id];
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {scrollY <= 0 ? 0 : scrollY / 1.5}px, 0);"
>
  <img
    class="h-[38vh] w-full object-cover object-top"
    src={data.anime.cover ?? data.anime.image}
    alt="{data.anime.title.english ?? data.anime.title.romaji} Cover"
  />
  <div class="scrim pointer-events-none absolute inset-0" />
</header>

<main class="relative">
  <section in:fade class="block px-4">
    <div
      class="mx-auto grid grid-cols-[240px_auto] grid-rows-1 gap-x-4 transition-[grid-template-columns] duration-200 lg:grid-cols-[300px_auto]"
    >
      <div class="relative m-0 -mt-[20vh]">
        <a
          href="https://anilist.co/anime/{data.anime.id}"
          target="_blank"
          rel="noreferrer"
          class="group"
        >
          <img
            src={data.anime.image}
            alt={data.anime.title.english ?? data.anime.title.romaji}
            style:--anime-color={data.anime.color}
            class="w-full rounded-lg object-cover shadow-xl ring ring-transparent transition-shadow duration-200
              {data.anime.color
              ? 'hover:ring-[var(--anime-color)] group-focus-visible:ring-[var(--anime-color)]'
              : 'hover:ring-accent group-focus-visible:ring-accent'}"
          />
        </a>
        <button
          class="btn mt-4 w-full shadow-xl backdrop-blur-xl {subscribed
            ? 'btn-outline btn-error'
            : 'btn-primary'}"
          on:click={() => {
            if (subscribed) {
              subscriptions.remove(data.anime);
              unwatchedSubscriptions.remove(data.anime);
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
            {#if subscribed}
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
        class="card block h-min w-auto bg-base-200 bg-opacity-80 p-4 shadow-xl backdrop-blur-xl backdrop-filter transition-colors duration-200"
        class:hover:bg-base-300={descriptionCollapsed}
        class:cursor-pointer={descriptionCollapsed}
        on:click={() => (descriptionCollapsed = false)}
      >
        <h1
          class="mb-4 text-3xl font-extrabold leading-none tracking-tight transition-[font-size] duration-200 md:text-4xl lg:text-5xl"
        >
          {data.anime.title.english ?? data.anime.title.romaji}
        </h1>
        <ul class="mb-4 flex flex-wrap gap-1">
          <div class="badge badge-accent badge-outline">
            {data.anime.type.replaceAll('_', ' ')}
          </div>
          {#if data.anime.isAdult}
            <div class="badge badge-error badge-outline">18+</div>
          {/if}
          <div class="badge badge-accent badge-outline">
            {data.anime.status}
          </div>
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
          class="h-min w-fit"
          class:line-clamp-[3]={descriptionCollapsed}
          class:lg:line-clamp-[6]={descriptionCollapsed}
        >
          {@html data.anime.description || '<i>No description available.</i>'}
        </p>
        <br />
        <p
          class="cursor-pointer font-semibold"
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

  <div class="divider" />

  <!-- EPISODES -->
  <EpisodeCarousel anime={data.anime} episodes={sortedEpisodes} bind:showImage>
    <div slot="header" class="flex justify-between">
      <div class="mb-4 flex items-center gap-1">
        <h1
          class="mr-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
        >
          Episodes
        </h1>
        {#if data.anime.episodes.length > 0}
          <a
            class="btn-outline btn-accent btn flex w-fit space-x-2"
            href="/{data.anime.id}/{lastWatched?.[lastWatched.length - 1]
              .episode.id ?? data.anime.episodes[0].id}"
          >
            <Fa icon={faPlayCircle} size="lg" />
            <!-- Check if not user has watched anime yet -->
            <span>
              {lastWatched ? 'Continue' : 'Start'} Watching
            </span>
          </a>
        {/if}
        <button
          class="btn-outline btn-accent btn"
          on:click={() => {
            animeCache.delete(data.anime.id);
            invalidate(data.anime.id);
          }}
        >
          <Fa icon={faRotateRight} />
        </button>
      </div>
      {#if data.anime.episodes.length > 0}
        <div class="dropdown-end dropdown block">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <label tabindex="0" class="btn-outline btn-accent btn w-fit">
            <Fa icon={faFilter} />
          </label>
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <ul
            tabindex="0"
            class="dropdown-content rounded-box z-10 mt-1 w-52 bg-base-100 p-2 shadow"
          >
            <li class="m-1">
              <button
                class="btn-outline btn-accent btn flex w-full flex-row items-center gap-1 text-base-content"
                disabled={isAscending}
                on:click={() => (isAscending = true)}
              >
                <Fa icon={faArrowUp} />
                Episode
              </button>
            </li>
            <li class="m-1">
              <button
                class="btn-outline btn-accent btn flex w-full flex-row items-center gap-1 text-base-content"
                disabled={!isAscending}
                on:click={() => (isAscending = false)}
              >
                <Fa icon={faArrowDown} />
                Episode
              </button>
            </li>
            <li class="m-1">
              <button
                class="btn-outline btn-accent btn flex w-full flex-row items-center gap-2 text-base-content"
                on:click={() => (showWatched = !showWatched)}
              >
                <input
                  type="checkbox"
                  checked={showWatched}
                  class="checkbox-accent checkbox"
                  tabindex="-1"
                />
                Show Watched
              </button>
            </li>
            <li class="m-1">
              <button
                class="btn-outline btn-accent btn flex w-full flex-row items-center gap-2 text-base-content"
                on:click={() => (showImage = !showImage)}
              >
                <input
                  type="checkbox"
                  checked={showImage}
                  class="checkbox-accent checkbox"
                  tabindex="-1"
                />
                Thumbnails
              </button>
            </li>
          </ul>
        </div>
      {/if}
    </div>
  </EpisodeCarousel>

  {#if data.anime.recommendations.length > 0}
    <div class="divider" />

    <!-- RECOMMENDATIONS -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Recommendations</svelte:fragment>
      <svelte:fragment slot="content">
        {#each data.anime.recommendations as anime (anime.id)}
          <AnimeCard {anime} />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}

  {#if relations.length > 0}
    <div class="divider" />

    <!-- RELATED -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Related</svelte:fragment>
      <svelte:fragment slot="content">
        {#each relations as anime (anime.id)}
          <AnimeCard {anime} />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}

  {#if data.anime.characters.length > 0}
    <div class="divider" />

    <!-- CHARACTERS -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Characters</svelte:fragment>
      <svelte:fragment slot="content">
        {#each data.anime.characters as character (character.id)}
          <CharacterCard {character} color={data.anime.color} />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}
</main>
