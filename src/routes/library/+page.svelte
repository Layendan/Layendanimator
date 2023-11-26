<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import DownloadsData from '$lib/components/DownloadsData.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import SubscriptionCarousel from '$lib/components/SubscriptionCarousel.svelte';
  import { watching } from '$lib/model/watch';
</script>

<div class="m-4">
  <!-- Downloads -->
  {#if window?.__TAURI__}
    <ScrollCarousel>
      <a
        slot="title"
        class="btn btn-ghost -m-2 h-max gap-4 p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
        href="/library/downloads"
      >
        Downloaded Animes
      </a>

      <DownloadsData />
    </ScrollCarousel>

    <div class="divider" />
  {/if}

  <!-- Recently Watched -->
  <ScrollCarousel>
    <a
      slot="title"
      class="btn btn-ghost -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
      href="/library/recent"
    >
      Watch History
    </a>

    {#each Object.entries($watching).sort(([, a], [, b]) => b.watchTime - a.watchTime) as [id, anime] (id)}
      <AnimeCard
        {anime}
        extra={`Episode ${anime.watchEpisode.number}`}
        showSource
      />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No Recent Animes
        </p>
      </div>
    {/each}
  </ScrollCarousel>

  <div class="divider" />

  <!-- Subscriptions -->
  <SubscriptionCarousel />
</div>
