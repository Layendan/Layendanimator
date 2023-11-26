<script lang="ts">
  import { getSortMethod, settings } from '$lib/model/settings';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import {
    isUpdatingSubscriptions,
    updateSubscriptions
  } from '$lib/model/updates';
  import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade } from 'svelte/transition';
  import AnimeCard from './AnimeCard.svelte';
  import ScrollCarousel from './ScrollCarousel.svelte';

  $: sortMethod = ($settings.sortSubscriptions, getSortMethod());
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
        on:click={updateSubscriptions}
      >
        {#if $isUpdatingSubscriptions}
          <span class="loading loading-ring" />
          Fetching
        {:else}
          <Fa icon={faArrowRotateRight} size="1.2x" />
          Fetch Updates
        {/if}
      </button>
    {/if}
  </div>

  {#each Object.entries($unwatchedSubscriptions).sort(sortMethod) as [id, anime] (id)}
    <AnimeCard {anime} bind:numUpdates={anime.newEpisodes} showSource />
  {/each}

  {#if Object.entries($unwatchedSubscriptions).length > 0 && Object.entries($subscriptions).length > 0}
    <div class="divider divider-horizontal" />
  {/if}

  {#each Object.entries($subscriptions).sort(sortMethod) as [id, anime] (id)}
    <AnimeCard {anime} showSource />
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
