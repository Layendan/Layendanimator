<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Player from '$lib/components/Player.svelte';
  import EpisodeCarousel from '$lib/components/EpisodeCarousel.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { goto, invalidate } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  import { faInfoCircle, faTv } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { episodeCache } from '$lib/model/cache';

  export let data: PageData;

  let descriptionCollapsed = true;
  let selectedTab: 'episodes' | 'wiki' =
    data.anime.episodes.filter(
      item => item.number > (data.episodeObject?.number ?? Infinity)
    ).length > 0
      ? 'episodes'
      : 'wiki';
  $: relations = data.anime.relations.filter(
    a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT'
  );
</script>

<Player
  sources={data.episode.sources}
  poster={data.anime.episodes.find(item => item.id === data.id)?.image ??
    data.anime.image}
  on:requestNextEpisode={() => {
    if (data.nextEpisode) {
      goto(
        data.store[data.nextEpisode.id]?.watched
          ? `/${data.anime.id}/${data.nextEpisode.id}?t=${
              data.store[data.nextEpisode.id].watched *
              data.store[data.nextEpisode.id].duration
            }`
          : `/${data.anime.id}/${data.nextEpisode.id}`,
        {
          replaceState: true
        }
      );
    }
  }}
  on:error={e => {
    console.error(e);
    episodeCache.delete(data.id);
    invalidate(data.id);
  }}
/>

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
    episodes={data.anime.episodes.filter(
      item => item.number > (data.episodeObject?.number ?? Infinity)
    )}
  >
    <svelte:fragment slot="title">Next episodes</svelte:fragment>
  </EpisodeCarousel>
{:else if selectedTab === 'wiki'}
  <main in:fade class="mt-4 block w-full px-4 lg:mt-0">
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
        {data.anime.episodes.find(item => item.id === data.id)?.title ??
          data.anime.title.english ??
          data.anime.title.romaji}
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
        {@html data.anime.episodes.find(item => item.id === data.id)
          ?.description ?? data.anime.description}
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
                  class="w-28 rounded-full ring ring-transparent transition-shadow duration-200"
                  class:hover:ring-[var(--anime-color)]={data.anime.color}
                  class:hover:ring-accent={!data.anime.color}
                >
                  <img src={character.image} alt={character.name.full} />
                </div>
              </div>
              <div
                class="group flex w-full flex-col gap-1 text-base-content text-opacity-80 hover:text-opacity-100"
              >
                <h3
                  class="text-md whitespace-normal font-bold leading-tight transition-colors duration-200 line-clamp-2"
                  class:group-hover:text-[var(--anime-color)]={data.anime.color}
                  class:group-hover:text-accent={!data.anime.color}
                >
                  {character.name.full}
                </h3>
                {#if character.name.native}
                  <h2
                    class="whitespace-normal text-xs leading-tight transition-colors duration-200 line-clamp-2"
                  >
                    {character.name.native}
                  </h2>
                {/if}
              </div>
            </a>
          {/each}
        </svelte:fragment>
      </ScrollCarousel>
    {/if}
  </main>
{:else}
  You shouldn't be here
{/if}
