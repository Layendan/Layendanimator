<script lang="ts">
  import { invalidate } from '$app/navigation';
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import CharacterCard from '$lib/components/CharacterCard.svelte';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import PlayNextButton from '$lib/components/PlayNextButton.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import ScrollHeader from '$lib/components/ScrollHeader.svelte';
  import TotalAnimeInfo from '$lib/components/TotalAnimeInfo.svelte';
  import { animeCache } from '$lib/model/cache';
  import type { Anime } from '$lib/model/classes/Anime';
  import { downloading } from '$lib/model/downloads';
  import { settings } from '$lib/model/settings';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';
  import {
    faChevronDown,
    faChevronUp,
    faClock,
    faCloudDownload,
    faDownload,
    faFilter,
    faLanguage
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  export let data: Anime;
  export let showDownload = false;
  export let removeParallax = false;

  $: reversedEpisodes = (data.episodes ?? []).toReversed();
  $: sortedEpisodes = $settings.isEpisodeAscending
    ? data.episodes ?? []
    : reversedEpisodes;
  $: relations = (data.relations ?? []).filter(
    a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT'
  );
  $: lastWatched = $watching[`${data.source.id}/${data.id}`];
  $: filteredEpisodes = sortedEpisodes.filter(({ id }) => {
    return (
      (lastWatched?.watchedEpisodes[id]?.percentage ?? 0) < watchPercentage
    );
  });

  const maxRelations = 15;
  const watchPercentage = 0.8;
</script>

<ScrollHeader anime={data} {removeParallax} />

<main class="relative m-4 mt-0">
  <TotalAnimeInfo anime={data} />

  <div class="divider" />

  <!-- EPISODES -->
  <EpisodeCarousel
    anime={data}
    episodes={$settings.showWatchedEpisodes ? sortedEpisodes : filteredEpisodes}
    href={showDownload
      ? undefined
      : `/library/downloads/${data.source.id}/${data.id}`}
  >
    <div slot="header" class="flex justify-between">
      <div class="mb-4 flex items-center gap-1">
        <h1
          class="mr-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
        >
          Episodes
        </h1>
        {#if sortedEpisodes.length > 0}
          <PlayNextButton
            anime={data}
            {watchPercentage}
            preHref={showDownload ? '' : '/library/downloads'}
          />
        {/if}
      </div>
      {#if sortedEpisodes.length > 0}
        <div class="mb-4 flex items-center gap-1">
          {#if showDownload && window?.__TAURI__}
            <div
              class="tooltip tooltip-bottom"
              data-tip="Download Unwatched Episodes"
            >
              <button
                class="btn"
                on:click={() =>
                  data.episodes
                    .filter(
                      episode =>
                        ($watching[`${data.source.id}/${data.id}`]
                          ?.watchedEpisodes[episode.id]?.percentage ?? 0) < 0.8
                    )
                    .forEach(episode =>
                      downloading.add(episode.id, data, '1080p', episode.number)
                    )}
                aria-label="Download Unwatched Episodes"
              >
                <Fa icon={faDownload} />
              </button>
            </div>
          {/if}

          <div class="tooltip tooltip-bottom" data-tip="Mark All as Watched">
            <button
              class="btn"
              on:click={() => {
                watching.watchAll(data, reversedEpisodes);
                if ($unwatchedSubscriptions[`${data.source.id}/${data.id}`]) {
                  unwatchedSubscriptions.remove(data);
                  subscriptions.add(data);
                }
              }}
              aria-label="Mark All Episodes as Watched"
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
                class="dropdown-content z-10 mt-1 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-1 text-base-content"
                    class:hidden={!$settings.showWatchedEpisodes &&
                      filteredEpisodes.length === 0}
                    on:click={() =>
                      ($settings.isEpisodeAscending =
                        !$settings.isEpisodeAscending)}
                    aria-label="Sort Episodes by {$settings.isEpisodeAscending
                      ? 'Descending'
                      : 'Ascending'}"
                  >
                    <Fa
                      icon={$settings.isEpisodeAscending
                        ? faChevronUp
                        : faChevronDown}
                    />
                    Sort
                  </button>
                </li>
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-2 text-base-content"
                    on:click={() =>
                      ($settings.showWatchedEpisodes =
                        !$settings.showWatchedEpisodes)}
                    aria-label="Show Watched Episodes"
                  >
                    <input
                      type="checkbox"
                      checked={$settings.showWatchedEpisodes}
                      class="checkbox"
                      tabindex="-1"
                    />
                    Show Watched
                  </button>
                </li>
                <li class="m-1">
                  <button
                    class="btn btn-outline flex w-full flex-row items-center gap-2 text-base-content"
                    on:click={() =>
                      ($settings.showThumbnail = !$settings.showThumbnail)}
                    class:hidden={!$settings.showWatchedEpisodes &&
                      filteredEpisodes.length === 0}
                    aria-label="Show Thumbnails"
                  >
                    <input
                      type="checkbox"
                      checked={$settings.showThumbnail}
                      class="checkbox"
                      tabindex="-1"
                    />
                    Thumbnails
                  </button>
                </li>
                {#if showDownload}
                  <li class="m-1">
                    <button
                      class="btn btn-outline flex w-full flex-row items-center gap-2 text-base-content"
                      on:click={() => {
                        $settings.isSubtitles = !$settings.isSubtitles;
                        data.episodes = [];
                        animeCache.delete(`${data.source.id}/${data.id}`);
                        invalidate(`${data.source.id}:${data.id}`);
                      }}
                      aria-label="Change to {$settings.isSubtitles
                        ? 'Dubbed'
                        : 'Subbed'} Episodes"
                    >
                      <Fa icon={faLanguage} />
                      {$settings.isSubtitles ? 'Subbed' : 'Dubbed'} Episodes
                    </button>
                  </li>
                {/if}
              </ul>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </EpisodeCarousel>

  {#if showDownload}
    {#if (data.recommendations ?? []).length > 0}
      <div class="divider" />

      <!-- RECOMMENDATIONS -->
      <ScrollCarousel>
        <svelte:fragment slot="title">Recommendations</svelte:fragment>
        {#each data.recommendations ?? [] as anime (anime.id)}
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

    {#if (data.characters ?? []).length > 0}
      <div class="divider" />

      <!-- CHARACTERS -->
      <ScrollCarousel>
        <svelte:fragment slot="title">Characters</svelte:fragment>
        {#each data.characters as character (character.id)}
          <CharacterCard {character} color={data.color} />
        {/each}
      </ScrollCarousel>
    {/if}
  {/if}
</main>
