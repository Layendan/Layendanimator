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
    faPlayCircle
  } from '@fortawesome/free-solid-svg-icons';

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

<header class="relative m-[-1rem] mb-4 z-0" style="top: {scrollY / 1.5}px;">
  <div class="absolute inset-0 scrim pointer-events-none" />
  <img
    class="w-full h-[38vh] object-cover object-top"
    src={data.anime.cover ?? data.anime.image}
    alt="{data.anime.title.english ?? data.anime.title.romaji} Cover"
  />
</header>

<main class="relative">
  <section in:fade class="block px-4">
    <div
      class="grid gap-x-4 grid-cols-[240px_auto] lg:grid-cols-[300px_auto] grid-rows-1 mx-auto transition-[grid-template-columns] duration-200"
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
            class="w-full object-cover rounded-lg shadow-xl ring ring-transparent transition-shadow duration-200"
            class:hover:ring-[var(--anime-color)]={data.anime.color}
            class:hover:ring-accent={!data.anime.color}
            style:--anime-color={data.anime.color}
          />
        </a>
        <button
          class="btn btn-primary w-full mt-4 bg-clip-border backdrop-blur-xl shadow-xl"
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
        class="block w-auto h-min p-4 card bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl transition-colors duration-200"
        class:hover:bg-base-300={descriptionCollapsed}
        class:cursor-pointer={descriptionCollapsed}
        on:click={() => (descriptionCollapsed = false)}
      >
        <h1
          class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl transition-[font-size] duration-200"
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
          class="w-fit h-min"
          class:line-clamp-[3]={descriptionCollapsed}
          class:lg:line-clamp-[6]={descriptionCollapsed}
        >
          {@html data.anime.description || '<i>No description available.</i>'}
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

  <div class="divider" />

  <!-- EPISODES -->
  <ScrollCarousel bind:key={sortedEpisodes}>
    <div slot="header" class="flex justify-between">
      <div class="flex items-center gap-4 mb-4">
        <h1
          class="text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
        >
          Episodes
        </h1>
        {#if data.anime.episodes.length > 0}
          <a
            class="btn btn-outline btn-accent w-fit flex space-x-2"
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
      </div>
      {#if data.anime.episodes.length > 0}
        <div class="block dropdown dropdown-end">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <label tabindex="0" class="btn btn-outline btn-accent w-fit">
            <Fa icon={faFilter} />
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
                <Fa icon={faArrowUp} />
                Episode
              </button>
            </li>
            <li class="m-1">
              <button
                class="btn btn-outline btn-accent w-full flex flex-row gap-1 text-base-content items-center"
                disabled={!isAscending}
                on:click={() => (isAscending = false)}
              >
                <Fa icon={faArrowDown} />
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
            in:fade
            href={data.store[episode.id]?.watched
              ? `/${data.anime.id}/${episode.id}?t=${
                  data.store[episode.id].watched *
                  data.store[episode.id].duration
                }`
              : `/${data.anime.id}/${episode.id}`}
            class="flex flex-col gap-2 w-[210px]"
          >
            <div
              class="relative bg-clip-content rounded-md m-0 p-0 card w-[210px] h-auto aspect-video bg-base-300 shadow-lg hover:-translate-y-1 transition-transform duration-200"
            >
              <img
                src={episode.image ?? 'loading_failure.jpeg'}
                alt={episode.title ?? `Episode ${episode.number}`}
                class="relative card-body m-0 p-0 w-full h-full aspect-video object-cover object-center rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-no-repeat bg-center"
              />
              <div class="relative mx-1">
                <div
                  style="width: {(data.store[episode.id]?.watched ?? 0) *
                    100}%;"
                  class="absolute bottom-1 left-0 right-0 h-1 bg-primary rounded-md"
                />
              </div>
            </div>
            <div
              class="flex flex-col gap-1 text-base-content text-opacity-80 group hover:text-opacity-100"
            >
              <h3
                style:--anime-color={data.anime.color}
                class="text-md font-bold leading-tight whitespace-normal line-clamp-2 text-base-content text-opacity-80 transition-colors duration-200"
                class:group-hover:text-[var(--anime-color)]={data.anime.color}
                class:group-hover:text-accent={!data.anime.color}
              >
                {episode.title || `Episode ${episode.number}`}
              </h3>
              {#if episode.title && episode.number}
                <h2
                  class="text-xs leading-none whitespace-normal transition-colors duration-200"
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

        <div class="card bg-base-300 p-8 h-full self-center">
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
          class="flex flex-col gap-2 w-32 items-center"
          style:--anime-color={data.anime.color}
        >
          <div class="avatar">
            <div
              class="w-28 rounded-full ring ring-transparent transition-shadow duration-200"
              class:hover:ring-[var(--anime-color)]={data.anime.color}
              class:hover:ring-accent={!data.anime.color}
            >
              <img src={character.image} alt={character.name.full} />
            </div>
          </div>
          <div
            class="flex flex-col w-full gap-1 text-base-content text-opacity-80 group hover:text-opacity-100"
          >
            <h3
              class="text-md font-bold leading-tight whitespace-normal line-clamp-2 transition-colors duration-200"
              class:group-hover:text-[var(--anime-color)]={data.anime.color}
              class:group-hover:text-accent={!data.anime.color}
            >
              {character.name.full}
            </h3>
            {#if character.name.native}
              <h2
                class="text-xs leading-tight whitespace-normal line-clamp-2 transition-colors duration-200"
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
