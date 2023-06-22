<script lang="ts">
  import type { PageData } from './$types';
  import Fa from 'svelte-fa';
  import {
    faArrowUp,
    faArrowDown,
    faFilter,
    faPlayCircle,
    faLanguage
  } from '@fortawesome/free-solid-svg-icons';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import { watching } from '$lib/model/watch';
  import TotalAnimeInfo from '$lib/components/TotalAnimeInfo.svelte';

  export let data: PageData;

  let scrollY = 0;
  let isAscending = true;
  let showWatched = true;
  let showImage: boolean;
  let isSub = true;
  let heroLoaded = true;
  $: reversedEpisodes = [...(data.episodes ?? [])].reverse();
  $: sortedEpisodes = isAscending ? data.episodes : reversedEpisodes;
  $: lastWatched = $watching[data.id];
  $: filteredEpisodes = showWatched
    ? sortedEpisodes
    : sortedEpisodes.filter(({ id }) => {
        return (
          (lastWatched?.watchedEpisodes[id]?.percentage ?? 0) < watchPercentage
        );
      });
  $: lastEpisode = data.episodes.at(-1);
  $: hasLastEpisode = lastWatched?.watchEpisode?.id === lastEpisode?.id;
  $: lastEpisodeFinished =
    !!lastEpisode &&
    (lastWatched?.watchedEpisodes[lastEpisode.id]?.percentage ?? 0) >=
      watchPercentage;

  const watchPercentage = 0.8;
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {scrollY <= 0 ? 0 : scrollY / 1.5}px, 0);"
>
  <img
    class="skeleton h-[38vh] w-full object-cover object-top"
    src={heroLoaded ? data.cover ?? data.image : '/assets/loading_failure.jpeg'}
    on:error={() => (heroLoaded = false)}
    alt="{data.title.english ?? data.title.romaji} Cover"
  />
  <div class="scrim pointer-events-none absolute inset-0" />
</header>

<main class="relative">
  <TotalAnimeInfo anime={data} />

  <div class="divider" />

  <!-- EPISODES -->
  <EpisodeCarousel
    anime={data}
    bind:episodes={filteredEpisodes}
    type={isSub ? 'sub' : 'dub'}
    href="/library/downloads/{data.id}"
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
            href="/library/downloads/{data.id}/{hasLastEpisode &&
            lastEpisodeFinished
              ? data.episodes[0].id
              : lastWatched?.watchEpisode?.id ?? data.episodes[0].id}"
          >
            <Fa icon={faPlayCircle} size="lg" />
            <!-- Check if not user has watched anime yet -->
            <span>
              {lastWatched?.watchEpisode
                ? hasLastEpisode && lastEpisodeFinished
                  ? 'Watch Again'
                  : 'Continue Watching'
                : 'Start Watching'}
            </span>
          </a>
        {/if}
      </div>
      {#if data.episodes.length > 0}
        <div class="mb-4 flex items-center gap-1">
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
                  class="btn-outline btn flex w-full flex-row items-center gap-1 text-base-content
                  {isAscending ? 'btn-disabled' : 'btn-accent '}"
                  disabled={isAscending}
                  on:click={() => (isAscending = true)}
                >
                  <Fa icon={faArrowUp} />
                  Episode
                </button>
              </li>
              <li class="m-1">
                <button
                  class="btn-outline btn flex w-full flex-row items-center gap-1 text-base-content
                  {!isAscending ? 'btn-disabled' : 'btn-accent '}"
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
</main>
