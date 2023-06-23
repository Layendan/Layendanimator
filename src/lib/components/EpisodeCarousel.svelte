<script lang="ts">
  import type { Anime, Episode as EpisodeType } from '$lib/model/classes/Anime';
  import Content from './Content.svelte';
  import EpisodeCard from './EpisodeCard.svelte';

  const gridLength = 11;
  const imageLength = 50;

  export let anime: Anime;
  export let episodes: EpisodeType[];
  export let showImage = episodes.length <= imageLength;
  export let replaceState = false;
  export let type: 'sub' | 'dub' = 'sub';
  export let href: string | undefined = undefined;

  $: nextEpisodeDate = new Date(
    Date.now() +
      new Date((anime.nextAiringEpisode?.timeUntilAiring ?? 0) * 1000).valueOf()
  );
  $: useGrid = episodes.length > gridLength || !showImage;
  $: days = Math.floor((nextEpisodeDate.valueOf() - Date.now()) / 86400000);
  $: hours = Math.floor(
    (((nextEpisodeDate.valueOf() - Date.now()) / 86400000) % 1) * 24
  );
  $: minutes = Math.floor(
    (((((nextEpisodeDate.valueOf() - Date.now()) / 86400000) % 1) * 24) % 1) *
      60
  );
</script>

<Content>
  <slot name="header">
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      <slot name="title" />
    </h1>
  </slot>
  <div class="relative {useGrid ? 'useGrid' : 'scroll'}">
    {#each episodes as episode (episode.id)}
      <EpisodeCard
        {anime}
        {episode}
        {showImage}
        {replaceState}
        {type}
        href={href
          ? `${href}/${episode.id}?dub=${type === 'dub'}`
          : `/${anime.id}/${episode.id}?dub=${type === 'dub'}`}
      />
    {:else}
      <div class="flex items-center justify-center">
        <p
          class="text-xl font-semibold text-center text-base-content text-opacity-70"
        >
          No Episodes Found
        </p>
      </div>
    {/each}
    {#if anime.nextAiringEpisode && episodes.length <= gridLength && showImage}
      <div class="divider divider-horizontal" />
      <div class="card h-max self-center bg-base-300 p-8">
        <p class="text-sm text-base-content text-opacity-80">
          Episode {anime.nextAiringEpisode.episode} airing in
        </p>
        <h2 class="text-lg font-bold">
          {#if days === 0 && hours === 0}
            {minutes}
            {minutes === 1 ? 'Minute' : 'Minutes'}
          {:else}
            {days}
            {days === 1 ? 'Day' : 'Days'},
            {hours}
            {hours === 1 ? 'Hour' : 'Hours'}
          {/if}
        </h2>
        <p class="text-sm text-base-content text-opacity-80">
          {new Date(anime.nextAiringEpisode.airingTime * 1000).toLocaleString(
            'en-US',
            {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: undefined,
              minute: undefined,
              timeZoneName: undefined
            }
          )}
        </p>
      </div>
    {/if}
  </div>
  {#if anime.nextAiringEpisode && useGrid}
    <div class="divider" />
    <div class="card h-max self-center bg-base-300 p-8">
      <p class="text-sm text-base-content text-opacity-80">
        Episode {anime.nextAiringEpisode.episode} airing in
      </p>
      <h2 class="text-lg font-bold">
        {#if days === 0 && hours === 0}
          {minutes}
          {minutes === 1 ? 'Minute' : 'Minutes'}
        {:else}
          {days}
          {days === 1 ? 'Day' : 'Days'},
          {hours}
          {hours === 1 ? 'Hour' : 'Hours'}
        {/if}
      </h2>
      <p class="text-sm text-base-content text-opacity-80">
        {new Date(anime.nextAiringEpisode.airingTime * 1000).toLocaleString(
          'en-US',
          {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: undefined,
            minute: undefined,
            timeZoneName: undefined
          }
        )}
      </p>
    </div>
  {/if}
</Content>

<style lang="postcss">
  .scroll {
    @apply inline-flex w-auto gap-6 overflow-x-scroll overscroll-x-contain whitespace-nowrap p-4 pb-6;
  }

  .useGrid {
    @apply grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] justify-items-center gap-x-4 gap-y-8 pt-4;
  }

  ::-webkit-scrollbar {
    @apply h-4 w-4;
  }

  ::-webkit-scrollbar-corner {
    @apply bg-transparent;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    @apply rounded-lg border-4 border-solid border-transparent bg-base-300 bg-clip-padding;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    @apply min-h-[40px] min-w-[40px] rounded-lg border-4 border-solid border-transparent bg-base-content bg-clip-padding;
  }
</style>
