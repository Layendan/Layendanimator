<script>
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import PlaceholderAnimeCard from '$lib/components/PlaceholderAnimeCard.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import { convertAnime, downloads } from '$lib/model/downloads';
  import { watching } from '$lib/model/watch';
</script>

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

<ScrollCarousel>
  <a
    slot="title"
    class="btn-ghost btn -m-2 h-max p-2 text-3xl font-extrabold normal-case leading-none tracking-tight md:text-4xl lg:text-5xl"
    href="/library/recent"
  >
    Recently Watched
  </a>

  <svelte:fragment slot="content">
    {#each Object.values($watching) as { anime, episode } (anime.id)}
      <AnimeCard {anime} extra={`Episode ${episode}`} />
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
