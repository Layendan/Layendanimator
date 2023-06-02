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

<GridContent>
  <svelte:fragment slot="title">Subscriptions</svelte:fragment>

  <svelte:fragment slot="content">
    {#each Object.values($unwatchedSubscriptions).sort(sortMethod) as anime (anime.id)}
      <AnimeCard {anime} bind:numUpdates={anime.newEpisodes} />
    {/each}

    {#each Object.values($subscriptions).sort(sortMethod) as anime (anime.id)}
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
  </svelte:fragment>
</GridContent>
