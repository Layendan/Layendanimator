<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import CharacterCard from '$lib/components/CharacterCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import type { PageData } from './$types';
  import Fa from 'svelte-fa';
  import {
    faArrowUp,
    faArrowDown,
    faFilter,
    faDownload,
    faClock
  } from '@fortawesome/free-solid-svg-icons';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import { watching } from '$lib/model/watch';
  import { downloading } from '$lib/model/downloads';
  import TotalAnimeInfo from '$lib/components/TotalAnimeInfo.svelte';
  import PlayNextButton from '$lib/components/PlayNextButton.svelte';
  import ScrollHeader from '$lib/components/ScrollHeader.svelte';

  export let data: PageData;

  let isAscending = true;
  let showWatched = true;
  let showImage: boolean;
  $: reversedEpisodes = [...(data.episodes ?? [])].reverse();
  $: sortedEpisodes = isAscending ? data.episodes : reversedEpisodes;
  $: relations = data.relations.filter(
    a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT'
  );
  $: lastWatched = $watching[`${data.source.id}/${data.id}`];

  const maxRelations = 15;
  const watchPercentage = 0.8;
</script>

<ScrollHeader anime={data} />

<main class="relative">
  <TotalAnimeInfo anime={data} />

  <div class="divider" />

  <!-- EPISODES -->
  <EpisodeCarousel
    anime={data}
    episodes={showWatched
      ? sortedEpisodes
      : sortedEpisodes.filter(({ id }) => {
          return (
            (lastWatched?.watchedEpisodes[id]?.percentage ?? 0) <
            watchPercentage
          );
        })}
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
          <PlayNextButton anime={data} {watchPercentage} />
        {/if}
      </div>
      {#if data.episodes.length > 0}
        <div class="mb-4 flex items-center gap-1">
          {#if window?.__TAURI__}
            <div class="tooltip tooltip-bottom" data-tip="Download Episodes">
              <button
                class="btn"
                on:click={() =>
                  data.episodes.forEach(episode =>
                    downloading.add(episode.id, data, '1080p', episode.number)
                  )}
              >
                <Fa icon={faDownload} />
              </button>
            </div>
          {/if}

          <div class="tooltip tooltip-bottom" data-tip="Mark All as Watched">
            <button
              class="btn"
              on:click={() => watching.watchAll(data, reversedEpisodes)}
            >
              <Fa icon={faClock} />
            </button>
          </div>

          <div class="tooltip tooltip-bottom" data-tip="Filters">
            <div class="dropdown dropdown-end block">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <label tabindex="0" class="btn w-fit">
                <Fa icon={faFilter} />
              </label>
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <ul
                tabindex="0"
                class="dropdown-content rounded-box z-10 mt-1 w-52 bg-base-100 p-2 shadow"
              >
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-1 text-base-content"
                    class:btn-disabled={isAscending}
                    disabled={isAscending}
                    on:click={() => (isAscending = true)}
                  >
                    <Fa icon={faArrowUp} />
                    Episode
                  </button>
                </li>
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-1 text-base-content"
                    class:btn-disabled={!isAscending}
                    disabled={!isAscending}
                    on:click={() => (isAscending = false)}
                  >
                    <Fa icon={faArrowDown} />
                    Episode
                  </button>
                </li>
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-2 text-base-content"
                    on:click={() => (showWatched = !showWatched)}
                  >
                    <input
                      type="checkbox"
                      checked={showWatched}
                      class="checkbox"
                      tabindex="-1"
                    />
                    Show Watched
                  </button>
                </li>
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-2 text-base-content"
                    on:click={() => (showImage = !showImage)}
                  >
                    <input
                      type="checkbox"
                      checked={showImage}
                      class="checkbox"
                      tabindex="-1"
                    />
                    Thumbnails
                  </button>
                </li>
              </ul>
            </div>
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
      {#each data.recommendations as anime (anime.id)}
        <AnimeCard {anime} />
      {/each}
    </ScrollCarousel>
  {/if}

  {#if relations.length > 0}
    <div class="divider" />

    <!-- RELATED -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Related</svelte:fragment>
      {#each relations as anime (anime.id)}
        <AnimeCard
          {anime}
          extra={relations.length > maxRelations
            ? ''
            : anime.relationType.replaceAll('_', ' ')}
        />
      {/each}
    </ScrollCarousel>
  {/if}

  {#if data.characters.length > 0}
    <div class="divider" />

    <!-- CHARACTERS -->
    <ScrollCarousel>
      <svelte:fragment slot="title">Characters</svelte:fragment>
      {#each data.characters as character (character.id)}
        <CharacterCard {character} color={data.color} />
      {/each}
    </ScrollCarousel>
  {/if}
</main>
