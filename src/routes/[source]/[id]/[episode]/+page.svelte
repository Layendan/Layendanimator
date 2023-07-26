<script lang="ts">
  import { sanitize } from 'isomorphic-dompurify';
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
  import AnimeInfo from '$lib/components/AnimeInfo.svelte';

  export let data: PageData;

  $: filteredEpisodes = data.anime.episodes.filter(
    ({ number }) => number > (data.episodeObject.number ?? Infinity)
  );
  // For some reason filteredEpisode is undefined when the page loads
  $: selectedTab = filteredEpisodes?.length > 0 ? 'episodes' : 'wiki';

  const filteredTypes = ['MANGA', 'NOVEL', 'ONE_SHOT'];
  $: relations = data.anime.relations.filter(
    ({ type }) => !filteredTypes.includes(type)
  );

  const maxRelations = 15;

  afterNavigate(() => {
    if ($unwatchedSubscriptions[`${data.anime.source.id}/${data.anime.id}`]) {
      unwatchedSubscriptions.remove(data.anime);
      subscriptions.add(data.anime);
    }

    watching.add(data.anime, data.episodeObject);
  });
</script>

{#key data.episodeObject.id}
  <Player
    episodeData={data.episode}
    poster={data.episodeObject.image ?? data.anime.image}
    anime={data.anime}
    episode={data.episodeObject}
    on:requestNextEpisode={async ({ detail }) => {
      await (data.nextEpisode
        ? goto(
            `/${data.anime.source.id}/${data.anime.id}/${data.nextEpisode.id}`,
            {
              replaceState: true
            }
          )
        : // Maybe Replace State?
          goto(`/${data.anime.source.id}/${data.anime.id}`));

      detail();
    }}
  />
{/key}

<div class="tabs-boxed tabs mx-auto mb-4 w-fit gap-1 bg-opacity-80 p-4 px-8">
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
          {@html sanitize(data.episodeObject.description)}
        </p>
      </section>

      <div class="divider" />
    {/if}

    <AnimeInfo anime={data.anime} />

    {#if data.anime.recommendations.length > 0}
      <div class="divider" />

      <!-- RECOMMENDATIONS -->
      <ScrollCarousel>
        <svelte:fragment slot="title">Recommendations</svelte:fragment>
        {#each data.anime.recommendations as anime (anime.id)}
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

    {#if data.anime.characters.length > 0}
      <div class="divider" />

      <!-- CHARACTERS -->
      <ScrollCarousel>
        <svelte:fragment slot="title">Characters</svelte:fragment>
        {#each data.anime.characters as character (character.id)}
          <CharacterCard {character} color={data.anime.color} />
        {/each}
      </ScrollCarousel>
    {/if}
  </main>
{:else}
  You shouldn't be here
{/if}
