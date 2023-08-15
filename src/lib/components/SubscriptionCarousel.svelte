<script lang="ts">
  import { preloadData } from '$app/navigation';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import Fa from 'svelte-fa';
  import ScrollCarousel from './ScrollCarousel.svelte';
  import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
  import AnimeCard from './AnimeCard.svelte';
  import { getSortMethod, settings } from '$lib/model/settings';
  import { animeCache } from '$lib/model/cache';
  import { fade } from 'svelte/transition';
  import Semaphore from '$lib/model/classes/Semaphore';

  $: sortMethod = ($settings.sortSubscriptions, getSortMethod());

  const semaphore = new Semaphore(5, 1000);

  let loading = false;
</script>

<ScrollCarousel>
  <div slot="header" class="-m-2 mb-4 flex h-full items-center gap-2">
    <a
      class="btn btn-ghost h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/library/subscriptions"
    >
      Subscriptions
    </a>

    {#if Object.entries($subscriptions).length > 0 || Object.entries($unwatchedSubscriptions).length > 0}
      <button
        class="btn btn-ghost h-fit bg-base-300"
        out:fade={{ duration: 200 }}
        on:click={async () => {
          loading = true;
          const totalSubs = [
            ...Object.values($subscriptions).filter(
              anime =>
                anime.status !== 'Completed' && anime.status !== 'Cancelled'
            ),
            ...Object.values($unwatchedSubscriptions).filter(
              anime =>
                anime.status !== 'Completed' && anime.status !== 'Cancelled'
            )
          ];
          totalSubs.forEach(anime =>
            animeCache.delete(`${anime.source.id}/${anime.id}`)
          );
          await Promise.allSettled(
            totalSubs.map(anime => {
              return semaphore.callFunction(
                () => preloadData(`/${anime.source.id}/${anime.id}`),
                `${anime.source.id}/${anime.id}`
              );
            })
          );
          loading = false;
        }}
      >
        {#if loading}
          <span class="loading loading-ring" />
          fetching
        {:else}
          <Fa icon={faArrowRotateRight} size="1.2x" />
          fetch updates
        {/if}
      </button>
    {/if}
  </div>

  {#each Object.entries($unwatchedSubscriptions).sort(sortMethod) as [id, anime] (id)}
    <AnimeCard {anime} bind:numUpdates={anime.newEpisodes} />
  {/each}

  {#if Object.entries($unwatchedSubscriptions).length > 0 && Object.entries($subscriptions).length > 0}
    <div class="divider divider-horizontal" />
  {/if}

  {#each Object.entries($subscriptions).sort(sortMethod) as [id, anime] (id)}
    <AnimeCard {anime} />
  {/each}

  <!-- Can't use else since it can only check one and not both -->
  {#if Object.entries($subscriptions).length === 0 && Object.entries($unwatchedSubscriptions).length === 0}
    <div class="flex items-center justify-center">
      <p
        class="text-center text-xl font-semibold text-base-content text-opacity-70"
      >
        No Subscriptions Added
      </p>
    </div>
  {/if}
</ScrollCarousel>
