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

{#if Object.entries($unwatchedSubscriptions).length > 0}
  <GridContent>
    <svelte:fragment slot="title">New Subscription Episodes</svelte:fragment>

    <svelte:fragment slot="content">
      {#each Object.values($unwatchedSubscriptions).sort(sortMethod) as anime (anime.id)}
        <AnimeCard {anime} bind:numUpdates={anime.newEpisodes} />
      {/each}
    </svelte:fragment>
  </GridContent>
{/if}

{#if Object.entries($unwatchedSubscriptions).length > 0 && Object.entries($subscriptions).length > 0}
  <div class="divider divider-vertical" />
{/if}

{#if Object.entries($subscriptions).length > 0}
  <GridContent>
    <svelte:fragment slot="title">Subscriptions</svelte:fragment>

    <svelte:fragment slot="content">
      {#each Object.values($subscriptions).sort(sortMethod) as anime (anime.id)}
        <AnimeCard {anime} />
      {/each}
    </svelte:fragment>
  </GridContent>
{/if}
