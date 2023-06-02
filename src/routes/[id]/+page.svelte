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
    faLanguage,
    faDownload
  } from '@fortawesome/free-solid-svg-icons';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import { watched } from '$lib/model/watch';
  import { downloading } from '$lib/model/downloads';

  export let data: PageData;

  let scrollY = 0;
  let descriptionCollapsed = true;
  let isAscending = true;
  let showWatched = true;
  let showImage: boolean;
  let isSub = true;
  $: reversedEpisodes = [...(data.episodes ?? [])].reverse();
  $: sortedEpisodes = isAscending ? data.episodes : reversedEpisodes;
  $: relations = data.relations.filter(
    a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT'
  );
  $: subscribed = $subscriptions[data.id] || $unwatchedSubscriptions[data.id];
  $: lastWatched = $watched[data.id];
  $: lastEpisode = lastWatched?.[lastWatched.length - 1];
  $: continueWatching =
    (lastEpisode?.percentage ?? Infinity) < watchPercentage
      ? lastEpisode?.episode
      : data.episodes.find(
          e => e.number > (lastEpisode?.episode.number ?? Infinity)
        ) ?? data.episodes[0];

  const maxRelations = 15;
  const watchPercentage = 0.8;
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {scrollY <= 0 ? 0 : scrollY / 1.5}px, 0);"
>
  <img
    class="skeleton h-[38vh] w-full object-cover object-top"
    src={data.cover ?? data.image}
    alt="{data.title.english ?? data.title.romaji} Cover"
  />
  <div class="scrim pointer-events-none absolute inset-0" />
</header>

<main class="relative">
  <section in:fade class="block">
    <div
      class="mx-auto grid grid-cols-[240px_auto] grid-rows-1 gap-x-4 transition-[grid-template-columns] duration-200 lg:grid-cols-[300px_auto]"
    >
      <div class="relative m-0 -mt-[20vh]">
        <a
          href="https://anilist.co/anime/{data.id}"
          target="_blank"
          rel="noreferrer"
          class="group"
        >
          <img
            src={data.image}
            alt={data.title.english ?? data.title.romaji}
            style:--anime-color={data.color}
            class="w-full rounded-lg bg-base-200 object-cover shadow-xl ring ring-transparent transition-shadow duration-200
              {data.color
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
              subscriptions.remove(data);
              unwatchedSubscriptions.remove(data);
            } else {
              subscriptions.add(data);
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
          {data.title.english ?? data.title.romaji}
        </h1>
        <ul class="mb-4 flex flex-wrap gap-1">
          <div class="badge badge-accent badge-outline">
            {data.type.replaceAll('_', ' ')}
          </div>
          {#if data.isAdult}
            <div class="badge badge-error badge-outline">18+</div>
          {/if}
          <div class="badge badge-accent badge-outline">
            {data.status}
          </div>
          {#each data.genres as genre}
            <div class="badge badge-accent badge-outline">{genre}</div>
          {/each}
          {#if data.rating}
            <div
              class="badge badge-outline"
              class:badge-error={data.rating <= 60}
              class:badge-warning={data.rating > 60 && data.rating <= 75}
              class:badge-success={data.rating > 75}
            >
              {data.rating}%
            </div>
          {/if}
        </ul>
        <p
          class="h-min w-fit"
          class:line-clamp-[3]={descriptionCollapsed}
          class:lg:line-clamp-[6]={descriptionCollapsed}
        >
          {@html data.description || '<i>No description available.</i>'}
        </p>
        <br />
        <button
          class="cursor-pointer font-semibold"
          on:click={e => {
            descriptionCollapsed = !descriptionCollapsed;
            e.stopPropagation();
          }}
        >
          Show {descriptionCollapsed ? 'more' : 'less'}
        </button>
      </div>
    </div>
  </section>

  <div class="divider" />

  <!-- EPISODES -->
  <EpisodeCarousel
    anime={data}
    episodes={showWatched
      ? sortedEpisodes
      : sortedEpisodes.filter(({ id }) => {
          return (
            (lastWatched.find(last => last.episode.id === id)?.percentage ??
              0) < watchPercentage
          );
        })}
    type={isSub ? 'sub' : 'dub'}
    bind:showImage
  >
    <div slot="header" class="flex justify-between">
      <div class="mb-4 flex items-center gap-1">
        <h1
          class="mr-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
        >
          Episodes
        </h1>
        {#if data.episodes.length > 0}
          <a
            class="btn-accent btn-outline btn flex w-fit space-x-2"
            href="/{data.id}/{continueWatching?.id ?? data.episodes[0].id}"
          >
            <Fa icon={faPlayCircle} size="lg" />
            <!-- Check if not user has watched anime yet -->
            <span>
              {continueWatching.id === data.episodes[0].id
                ? lastWatched
                  ? 'Watch Again'
                  : 'Start Watching'
                : 'Continue Watching'}
            </span>
          </a>
        {/if}
      </div>
      {#if data.episodes.length > 0}
        <div class="mb-4 flex items-center gap-1">
          {#if window?.__TAURI__}
            <button
              class="btn-accent btn-outline btn"
              on:click={() =>
                data.episodes.forEach(episode =>
                  downloading.add(episode.id, data, '1080p', episode.number)
                )}
            >
              <Fa icon={faDownload} />
            </button>
          {/if}
          <div class="dropdown-end dropdown block">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <label tabindex="0" class="btn-accent btn-outline btn w-fit">
              <Fa icon={faLanguage} />
            </label>
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul
              tabindex="0"
              class="dropdown-content rounded-box z-10 mt-1 w-32 bg-base-100 p-2 shadow"
            >
              <li class="m-1">
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Sub</span>
                    <input
                      type="radio"
                      name="radio-10"
                      class="radio-accent radio"
                      checked={isSub}
                      on:click={() => {
                        isSub = true;
                      }}
                    />
                  </label>
                </div>
              </li>
              <li class="m-1">
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Dub</span>
                    <input
                      type="radio"
                      name="radio-10"
                      class="radio-accent radio"
                      checked={!isSub}
                      on:click={() => {
                        isSub = false;
                      }}
                    />
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div class="dropdown-end dropdown block">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <label tabindex="0" class="btn-accent btn-outline btn w-fit">
              <Fa icon={faFilter} />
            </label>
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <ul
              tabindex="0"
              class="dropdown-content rounded-box z-10 mt-1 w-52 bg-base-100 p-2 shadow"
            >
              <li class="m-1">
                <button
                  class="btn-accent btn-outline btn flex w-full flex-row items-center gap-1 text-base-content"
                  disabled={isAscending}
                  on:click={() => (isAscending = true)}
                >
                  <Fa icon={faArrowUp} />
                  Episode
                </button>
              </li>
              <li class="m-1">
                <button
                  class="btn-accent btn-outline btn flex w-full flex-row items-center gap-1 text-base-content"
                  disabled={!isAscending}
                  on:click={() => (isAscending = false)}
                >
                  <Fa icon={faArrowDown} />
                  Episode
                </button>
              </li>
              <li class="m-1">
                <button
                  class="btn-accent btn-outline btn flex w-full flex-row items-center gap-2 text-base-content"
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
                  class="btn-accent btn-outline btn flex w-full flex-row items-center gap-2 text-base-content"
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
        </div>
      {/if}
    </div>
  </EpisodeCarousel>

  {#if data.recommendations.length > 0}
    <div class="divider" />

    <!-- RECOMMENDATIONS -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Recommendations</svelte:fragment>
      <svelte:fragment slot="content">
        {#each data.recommendations as anime (anime.id)}
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
          <AnimeCard
            {anime}
            extra={relations.length > maxRelations
              ? ''
              : anime.relationType.replaceAll('_', ' ')}
          />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}

  {#if data.characters.length > 0}
    <div class="divider" />

    <!-- CHARACTERS -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Characters</svelte:fragment>
      <svelte:fragment slot="content">
        {#each data.characters as character (character.id)}
          <CharacterCard {character} color={data.color} />
        {/each}
      </svelte:fragment>
    </ScrollCarousel>
  {/if}
</main>
