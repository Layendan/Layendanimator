<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { fade } from 'svelte/transition';
  import { subscriptions } from '$lib/model/subscriptions';
  import type { PageData } from './$types';
  import type { Episode } from '$lib/model/Anime';
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

  export let data: PageData;
  const watchPercentage = 0.8;
  let scrollY = 0;
  let descriptionCollapsed = true;
  let isAscending = true;
  let showWatched = true;
  $: sortedEpisodes = sortEpisodes(data.anime.episodes, isAscending);

  const nextEpisodeDate = new Date(
    Date.now() +
      new Date(
        (data.anime.nextAiringEpisode?.timeUntilAiring ?? 0) * 1000
      ).valueOf()
  );

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

<header
  class="relative -m-4 mb-4"
  style="transform: translate3d(0, {scrollY / 1.5}px, 0);"
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
        >
          <img
            src={data.anime.image}
            alt={data.anime.title.english ?? data.anime.title.romaji}
            style:--anime-color={data.anime.color}
            class={`w-full rounded-lg object-cover shadow-xl ring ring-transparent transition-shadow duration-200
              ${
                data.anime.color
                  ? 'hover:ring-[var(--anime-color)]'
                  : 'hover:ring-accent'
              }`}
          />
        </a>
        <button
          class="btn-primary btn mt-4 w-full shadow-xl backdrop-blur-xl"
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
  <ScrollCarousel bind:key={sortedEpisodes}>
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
            href={`/${data.anime.id}/${
              lastEpisodeWatched?.id ?? data.anime.episodes[0].id
            }`}
          >
            <Fa icon={faPlayCircle} size="lg" />
            <!-- Check if not user has watched anime yet -->
            <span>
              {lastEpisodeWatched ? 'Continue' : 'Start'} Watching
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
                />
                Show Watched
              </button>
            </li>
          </ul>
        </div>
      {/if}
    </div>

    <svelte:fragment slot="content">
      {#each sortedEpisodes as episode (episode.id)}
        {#if showWatched || (data.store[episode.id]?.watched ?? 0) < watchPercentage}
          <a
            in:fade
            href={data.store[episode.id]?.watched
              ? `/${data.anime.id}/${episode.id}?t=${
                  data.store[episode.id].watched *
                  data.store[episode.id].duration
                }`
              : `/${data.anime.id}/${episode.id}`}
            class="flex w-[210px] flex-col gap-2"
          >
            <div
              class="card relative m-0 aspect-video h-auto w-[210px] rounded-md bg-base-300 bg-clip-content p-0 shadow-lg transition-transform duration-200 hover:-translate3d-y-1"
            >
              <img
                src={episode.image ?? 'loading_failure.jpeg'}
                alt={episode.title ?? `Episode ${episode.number}`}
                class="card-body relative m-0 aspect-video h-full w-full rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-center bg-no-repeat object-cover object-center p-0"
              />
              <div class="relative mx-1">
                <div
                  style="width: {(data.store[episode.id]?.watched ?? 0) *
                    100}%;"
                  class="absolute bottom-1 left-0 right-0 h-1 rounded-md bg-primary"
                />
              </div>
            </div>
            <div
              class="group flex flex-col gap-1 text-base-content text-opacity-80 hover:text-opacity-100"
            >
              <h3
                style:--anime-color={data.anime.color}
                class={`text-md whitespace-normal font-bold leading-tight text-base-content text-opacity-80 transition-colors duration-200 line-clamp-2
                ${
                  data.anime.color
                    ? 'group-hover:text-[var(--anime-color)]'
                    : 'group-hover:text-accent'
                }`}
              >
                {episode.title || `Episode ${episode.number}`}
              </h3>
              {#if episode.title && episode.number}
                <h2
                  class="whitespace-normal text-xs leading-none transition-colors duration-200"
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
      {#if data.anime.nextAiringEpisode}
        <div class="divider divider-horizontal mx-0" />

        <div class="card h-full self-center bg-base-300 p-8">
          <p class="text-sm text-base-content text-opacity-80">
            Episode {data.anime.nextAiringEpisode.episode} airing in
          </p>
          <h2 class="text-lg font-bold">
            {Math.floor((nextEpisodeDate.valueOf() - Date.now()) / 86400000)} Days,
            {Math.floor(
              (((nextEpisodeDate.valueOf() - Date.now()) / 86400000) % 1) * 24
            )} Hours
          </h2>
          <p class="text-sm text-base-content text-opacity-80">
            {new Date(
              data.anime.nextAiringEpisode.airingTime * 1000
            ).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: undefined,
              minute: undefined,
              timeZoneName: undefined
            })}
          </p>
        </div>
      {/if}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />

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

  <div class="divider" />

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

  <div class="divider" />

  <!-- CHARACTERS -->
  <ScrollCarousel bind:key={data.anime.relations}>
    <svelte:fragment slot="title">Characters</svelte:fragment>
    <svelte:fragment slot="content">
      {#each data.anime.characters as character}
        <a
          in:fade
          href="https://anilist.co/character/{character.id}"
          target="_blank"
          rel="noreferrer"
          class="flex w-32 flex-col items-center gap-2"
          style:--anime-color={data.anime.color}
        >
          <div class="avatar">
            <div
              class={`w-28 rounded-full ring ring-transparent transition-shadow duration-200 
              ${
                data.anime.color
                  ? 'hover:ring-[var(--anime-color)]'
                  : 'hover:ring-accent'
              }`}
            >
              <img src={character.image} alt={character.name.full} />
            </div>
          </div>
          <div
            class="group flex w-full flex-col gap-1 text-base-content text-opacity-80 hover:text-opacity-100"
          >
            <h3
              class={`text-md whitespace-normal font-bold leading-tight transition-colors duration-200 line-clamp-2 
              ${
                data.anime.color
                  ? 'group-hover:text-[var(--anime-color)]'
                  : 'group-hover:text-accent'
              }`}
            >
              {character.name.full}
            </h3>
            {#if character.name.native}
              <h2
                class="native-name whitespace-normal text-xs leading-tight transition-colors duration-200 line-clamp-2"
              >
                {character.name.native}
              </h2>
            {/if}
          </div>
        </a>
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Characters Found
          </p>
        </div>
      {/each}
    </svelte:fragment>
  </ScrollCarousel>
</main>

<style>
  .native-name {
    font-family: 'FOT-NewRodin Pro M';
  }
</style>
