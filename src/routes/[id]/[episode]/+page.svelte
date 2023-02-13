<script lang="ts">
  import AnimeCard from '$lib/components/AnimeCard.svelte';
  import Player from '$lib/components/Player.svelte';
  import ScrollCarousel from '$lib/components/ScrollCarousel.svelte';
  import FastForward from '$lib/components/svg/FastForward.svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;

  let descriptionCollapsed = true;
  const nextEpisodeDate = new Date(
    Date.now() +
      new Date(
        (data.anime.nextAiringEpisode?.timeUntilAiring ?? 0) * 1000
      ).valueOf()
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
/>

<main class="grid gap-4 grid-cols-1 lg:grid-cols-[calc(100%-400px-1rem)_400px]">
  <section in:fade class="block w-full px-4 mt-4 lg:mt-0">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="block w-auto h-min p-4 card bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl transition-colors duration-200"
      class:hover:bg-base-300={descriptionCollapsed}
      class:cursor-pointer={descriptionCollapsed}
      on:click={() => (descriptionCollapsed = false)}
    >
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl transition-[font-size] duration-200"
      >
        {data.anime.episodes.find(item => item.id === data.id)?.title ??
          data.anime.title.english ??
          data.anime.title.romaji}
      </h1>
      <ul class="flex flex-wrap gap-1 mb-4">
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
        class="w-fit h-min"
        class:line-clamp-[2]={descriptionCollapsed}
        class:lg:line-clamp-[4]={descriptionCollapsed}
      >
        {@html data.anime.episodes.find(item => item.id === data.id)
          ?.description ?? data.anime.description}
      </p>
      <br />
      <p
        class="font-semibold cursor-pointer"
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
    </div>

    <div class="hidden lg:inline">
      <div class="divider" />

      <!-- RECOMMENDATIONS -->
      <ScrollCarousel bind:key={data.anime.recommendations}>
        <svelte:fragment slot="title">Recommendations</svelte:fragment>
        <svelte:fragment slot="content">
          {#each data.anime.recommendations as anime}
            <AnimeCard {anime} />
          {:else}
            <div class="flex items-center justify-center">
              <p
                class="text-xl font-semibold text-center text-base-content text-opacity-70"
              >
                No Recommendations
              </p>
            </div>
          {/each}
        </svelte:fragment>
      </ScrollCarousel>

      <div class="divider" />

      <!-- RELATED -->
      <ScrollCarousel bind:key={data.anime.relations}>
        <svelte:fragment slot="title">Related</svelte:fragment>
        <svelte:fragment slot="content">
          {#each data.anime.relations.filter(a => a.type !== 'MANGA' && a.type !== 'NOVEL' && a.type !== 'ONE_SHOT') as anime}
            <AnimeCard {anime} />
          {:else}
            <div class="flex items-center justify-center">
              <p
                class="text-xl font-semibold text-center text-base-content text-opacity-70"
              >
                No Related Animes Found
              </p>
            </div>
          {/each}
        </svelte:fragment>
      </ScrollCarousel>

      <div class="divider" />

      <!-- CHARACTERS -->
      <ScrollCarousel bind:key={data.anime.relations}>
        <svelte:fragment slot="title">Characters</svelte:fragment>
        <svelte:fragment slot="content">
          {#each data.anime.characters as character}
            <a
              in:fade
              href="https://anilist.co/character/{character.id}"
              target="_blank"
              rel="noreferrer"
              class="flex flex-col gap-2 w-32 items-center"
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
                class="flex flex-col w-full gap-1 text-base-content text-opacity-80 group hover:text-opacity-100"
              >
                <h3
                  class="text-md font-bold leading-tight whitespace-normal line-clamp-2 transition-colors duration-200"
                  class:group-hover:text-[var(--anime-color)]={data.anime.color}
                  class:group-hover:text-accent={!data.anime.color}
                >
                  {character.name.full}
                </h3>
                {#if character.name.native}
                  <h2
                    class="text-xs leading-tight whitespace-normal line-clamp-2 transition-colors duration-200"
                  >
                    {character.name.native}
                  </h2>
                {/if}
              </div>
            </a>
          {:else}
            <div class="flex items-center justify-center">
              <p
                class="text-xl font-semibold text-center text-base-content text-opacity-70"
              >
                No Characters Found
              </p>
            </div>
          {/each}
        </svelte:fragment>
      </ScrollCarousel>
    </div>
  </section>

  <div class="divider lg:hidden" />

  <!-- EPISODES -->
  <section class="w-[400px] mx-auto">
    <div class="flex flex-col gap-y-8">
      {#each data.anime.episodes.filter(item => item.number > (data.episodeObject?.number ?? Infinity)) as episode}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          in:fade
          tabindex="0"
          on:click={() =>
            goto(
              data.store[episode.id]?.watched
                ? `/${data.anime.id}/${episode.id}?t=${
                    data.store[episode.id].watched *
                    data.store[episode.id].duration
                  }`
                : `/${data.anime.id}/${episode.id}`,
              {
                replaceState: true
              }
            )}
          on:keydown={e => {
            if (e.key !== 'Enter') return;
            goto(
              data.store[episode.id]?.watched
                ? `/${data.anime.id}/${episode.id}?t=${
                    data.store[episode.id].watched *
                    data.store[episode.id].duration
                  }`
                : `/${data.anime.id}/${episode.id}`,
              {
                replaceState: true
              }
            );
          }}
          class="flex flex-col gap-2 w-[400px] cursor-pointer"
        >
          <div
            class="relative bg-clip-content m-0 p-0 card w-[400px] h-auto aspect-video bg-base-300 shadow-lg hover:-translate-y-1 transition-transform duration-200"
          >
            <img
              src={episode.image ?? 'loading_failure.jpeg'}
              alt={episode.title ?? `Episode ${episode.number}`}
              class="relative card-body m-0 p-0 w-full h-full aspect-video object-cover object-center rounded-[0.8rem] bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-no-repeat bg-center shadow-xl"
            />
            {#if episode.id === data.nextEpisode.id}
              <div
                class="absolute inset-0 bg-base-200 bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-[0.8rem]"
              >
                <p
                  class="absolute w-full h-full inline-flex items-center justify-center uppercase text-2xl font-bold gap-1"
                >
                  <FastForward width={24} height={24} />
                  Next Episode
                </p>
              </div>
            {/if}
            <div class="relative mx-1">
              <div
                style="width: {(data.store[episode.id]?.watched ?? 0) * 100}%;"
                class="absolute bottom-1 left-0 right-0 h-1 bg-primary rounded-md"
              />
            </div>
          </div>
          <div
            class="flex flex-col gap-1 text-base-content text-opacity-80 group hover:text-opacity-100"
          >
            <h3
              style:--anime-color={data.anime.color}
              class="text-md font-bold leading-tight whitespace-normal line-clamp-2 text-base-content text-opacity-80 transition-colors duration-200"
              class:group-hover:text-[var(--anime-color)]={data.anime.color}
              class:group-hover:text-accent={!data.anime.color}
            >
              {episode.title || `Episode ${episode.number}`}
            </h3>
            {#if episode.title && episode.number}
              <h2
                class="text-xs leading-none whitespace-normal transition-colors duration-200"
              >
                Episode {episode.number}
              </h2>
            {/if}
          </div>
        </div>
      {:else}
        {#if data.anime.nextAiringEpisode}
          <div class="card bg-base-200 p-8 h-full w-full self-center shadow-xl">
            <p class="text-sm text-base-content text-opacity-80">
              Episode {data.anime.nextAiringEpisode.episode} airing in
            </p>
            <h2 class="text-lg font-bold">
              {Math.floor((nextEpisodeDate.valueOf() - Date.now()) / 86400000)} Days,
              {Math.floor(
                (((nextEpisodeDate.valueOf() - Date.now()) / 86400000) % 1) * 24
              )} Hours
            </h2>
            <p class="text-sm text-base-content text-opacity-80">
              {new Date(
                data.anime.nextAiringEpisode.airingTime * 1000
              ).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: undefined,
                minute: undefined,
                timeZoneName: undefined
              })}
            </p>
          </div>
        {:else}
          <div class="card bg-base-200 p-8 h-full w-full self-center shadow-xl">
            <h2 class="text-lg font-bold">Finished Watching</h2>
          </div>
        {/if}
      {/each}
    </div>
  </section>
</main>
