<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import CharacterCard from '$lib/components/CharacterCard.svelte';
  import Player from '$lib/components/Player.svelte';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { afterNavigate, goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import { faInfoCircle, faTv } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';

  export let data: PageData;

  $: filteredEpisodes = data.anime.episodes.filter(
    ({ number }) => number > (data.episodeObject.number ?? Infinity)
  );
  let descriptionCollapsed = true;
  // For some reason filteredEpisode is undefined when the page loads
  $: selectedTab = filteredEpisodes?.length > 0 ? 'episodes' : 'wiki';

  const filteredTypes = ['MANGA', 'NOVEL', 'ONE_SHOT'];
  $: relations = data.anime.relations.filter(
    ({ type }) => !filteredTypes.includes(type)
  );

  const maxRelations = 15;

  afterNavigate(() => {
    if (
      $unwatchedSubscriptions.find(({ anime: { id } }) => id === data.anime.id)
    ) {
      unwatchedSubscriptions.remove(data.anime);
      subscriptions.add(data.anime);
    }

    watching.add(data.anime, data.episodeObject.number);
  });
</script>

{#key data.episodeObject.id}
  <Player
    sources={data.episode.sources}
    poster={data.episodeObject.image ?? data.anime.image}
    anime={data.anime}
    episode={data.episodeObject}
    on:requestNextEpisode={() => {
      if (data.nextEpisode)
        goto(`/${data.anime.id}/${data.nextEpisode.id}`, {
          replaceState: true
        });
      else window.history.back();
    }}
  />
{/key}

<div class="tabs tabs-boxed mx-auto mb-4 w-fit gap-1 bg-opacity-80 p-4 px-8">
  <button
    class="tab"
    class:tab-active={selectedTab === 'episodes'}
    on:click={() => (selectedTab = 'episodes')}
  >
    <Fa icon={faTv} />
  </button>
  <button
    class="tab"
    class:tab-active={selectedTab === 'wiki'}
    on:click={() => (selectedTab = 'wiki')}
  >
    <Fa icon={faInfoCircle} size="1.2x" />
  </button>
</div>

{#if selectedTab === 'episodes'}
  <EpisodeCarousel
    anime={data.anime}
    episodes={data.anime.episodes}
    replaceState
    focus={data.episodeObject.id}
    href="/downloads/{data.anime.id}"
  >
    <svelte:fragment slot="title">Next episodes</svelte:fragment>
  </EpisodeCarousel>
{:else if selectedTab === 'wiki'}
  <main in:fade class="mt-4 block w-full px-4 lg:mt-0">
    {#if data.episodeObject.title && data.episodeObject.description}
      <section
        class="card max-w-full bg-base-200 bg-opacity-80 bg-clip-padding p-8 shadow-xl backdrop-blur-xl backdrop-filter transition-colors duration-200"
      >
        <h1
          class="mb-4 text-3xl font-extrabold leading-none tracking-tight transition-[font-size] duration-200 md:text-4xl lg:text-5xl"
        >
          {data.episodeObject.title}
        </h1>
        <p class="h-min w-fit">
          {@html data.episodeObject.description}
        </p>
      </section>

      <div class="divider" />
    {/if}

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <section
      class="card max-w-full bg-base-200 bg-opacity-80 bg-clip-padding p-8 shadow-xl backdrop-blur-xl backdrop-filter transition-colors duration-200"
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
        class:line-clamp-[2]={descriptionCollapsed}
        class:lg:line-clamp-[4]={descriptionCollapsed}
      >
        {@html data.anime.description}
      </p>
      <br />
      <p
        class="cursor-pointer font-semibold"
        on:click={e => {
          descriptionCollapsed = !descriptionCollapsed;
          e.stopPropagation();
        }}
      >
        Show {descriptionCollapsed ? 'more' : 'less'}
      </p>
    </section>

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
{:else}
  You shouldn't be here
{/if}
