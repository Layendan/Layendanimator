<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
  import { getSortMethod, settings } from '$lib/model/settings';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';

  $: sortMethod = ($settings.sortSubscriptions, getSortMethod());
</script>

<div class="m-4">
  {#if Object.entries($unwatchedSubscriptions).length > 0}
    <GridContent>
      <svelte:fragment slot="title">New Updates</svelte:fragment>

      {#each Object.entries($unwatchedSubscriptions).sort(sortMethod) as [id, anime] (id)}
        <AnimeCard
          {anime}
          bind:numUpdates={anime.newEpisodes.size}
          showSource
        />
      {/each}
    </GridContent>
  {/if}

  {#if Object.entries($unwatchedSubscriptions).length > 0 && Object.entries($subscriptions).length > 0}
    <div class="divider divider-vertical" />
  {/if}

  {#if Object.entries($subscriptions).length > 0}
    <GridContent>
      <svelte:fragment slot="title">Subscriptions</svelte:fragment>

      {#each Object.entries($subscriptions).sort(sortMethod) as [id, anime] (id)}
        <AnimeCard {anime} showSource />
      {/each}
    </GridContent>
  {/if}

  {#if Object.entries($unwatchedSubscriptions).length === 0 && Object.entries($subscriptions).length === 0}
    <GridContent>
      <svelte:fragment slot="title">Subscriptions</svelte:fragment>

      <p class="text-xl font-semibold text-base-content text-opacity-70">
        No Subscriptions Added
      </p>
    </GridContent>
  {/if}
</div>
