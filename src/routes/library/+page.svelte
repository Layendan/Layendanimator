<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { convertAnime, downloads } from '$lib/model/downloads';
  import { getSortMethod, settings } from '$lib/model/settings';
  import {
    unwatchedSubscriptions,
    subscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';

  $: sortMethod = ($settings.sortSubscriptions, getSortMethod());
</script>

<!-- Downloads -->
{#if window?.__TAURI__}
  <ScrollCarousel>
    <a
      slot="title"
      class="btn-ghost btn -m-2 h-max gap-4 p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/library/downloads"
    >
      Downloaded Animes
    </a>

    <svelte:fragment slot="content">
      {#each Object.values($downloads) as { anime } (anime.id)}
        {#await convertAnime(anime)}
          <PlaceholderAnimeCard />
        {:then anime}
          <AnimeCard {anime} href="/library/downloads/{anime.id}" />
        {/await}
      {:else}
        <div class="flex items-center justify-center">
          <p
            class="text-xl font-semibold text-center text-base-content text-opacity-70"
          >
            No Downloads
          </p>
        </div>
      {/each}
    </svelte:fragment>
  </ScrollCarousel>

  <div class="divider" />
{/if}

<!-- Recently Watched -->
<ScrollCarousel>
  <a
    slot="title"
    class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
    href="/library/recent"
  >
    Recently Watched
  </a>

  <svelte:fragment slot="content">
    {#each Object.values($watching).sort((a, b) => b.watchTime - a.watchTime) as anime (anime.id)}
      <AnimeCard {anime} extra={`Episode ${anime.watchEpisode}`} />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No Recent Animes
        </p>
      </div>
    {/each}
  </svelte:fragment>
</ScrollCarousel>

<div class="divider" />

<!-- Subscriptions -->
<ScrollCarousel>
  <a
    slot="title"
    class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
    href="/library/subscriptions"
  >
    Subscriptions
  </a>

  <svelte:fragment slot="content">
    {#each Object.values($unwatchedSubscriptions).sort(sortMethod) as anime (anime.id)}
      <AnimeCard {anime} bind:numUpdates={anime.newEpisodes} />
    {/each}

    {#if Object.entries($unwatchedSubscriptions).length > 0 && Object.entries($subscriptions).length > 0}
      <div class="divider divider-horizontal" />
    {/if}

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
</ScrollCarousel>
