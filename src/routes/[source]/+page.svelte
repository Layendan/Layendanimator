<script lang="ts">
  import Anime from "$lib/components/Anime.svelte";
  import Section from "$lib/components/Section.svelte";
  import { history } from "$lib/model/history";
  import { library } from "$lib/model/library";
  import { activeSources } from "$lib/model/sources";
  import type { PageData } from "./$types";
  import { capitalize } from "$lib/model/global";
  import { settings } from "$lib/model/settings";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import AnimeCard from "$lib/components/AnimeCard.svelte";
  import AnimeCardSmall from "$lib/components/AnimeCardSmall.svelte";

  export let data: PageData;
</script>

<section>
  <header>
    {#each $activeSources as source}
      <a
        href={source.id}
        class:selected={source.id === data.source.id}
        data-sveltekit-prefetch
      >
        {capitalize(source.name)}
      </a>
    {/each}
  </header>
  <SearchBar source={data.source} />
  {#if data.source.mainPage.recentEpisodes}
    <Section storageId="{data.source.id}-new-episodes:scroll">
      <svelte:fragment slot="title">New Episodes</svelte:fragment>
      <svelte:fragment slot="animes">
        {#await data.recentEpisodes.data}
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
        {:then recentEpisodes}
          {#each recentEpisodes as { episode, media }, i}
            <AnimeCardSmall
              {media}
              {episode}
              source={data.source.id}
              delay={$settings.reduceMotion ? 0 : i * 100}
              on:click={() =>
                ($history.browse = [
                  media,
                  ...$history.browse.filter((item) => item.id !== media.id),
                ])}
            />
          {/each}
        {:catch error}
          <p>{error}</p>
        {/await}
      </svelte:fragment>
    </Section>
  {/if}
  <Section storageId="Subscriptions:scroll">
    <svelte:fragment slot="title">Subscriptions</svelte:fragment>
    <svelte:fragment slot="animes">
      {#each $library.subscriptions as { media, source }, i}
        {#if source}
          <AnimeCard
            {media}
            source={source.id}
            delay={$settings.reduceMotion ? 0 : i * 100}
            on:click={() =>
              ($history.browse = [
                media,
                ...$history.browse.filter((item) => item.id !== media.id),
              ])}
          />
        {:else}
          <AnimeCard
            {media}
            delay={$settings.reduceMotion ? 0 : i * 100}
            on:click={() =>
              ($history.browse = [
                media,
                ...$history.browse.filter((item) => item.id !== media.id),
              ])}
          />
        {/if}
      {:else}
        <p class="sub-placeholder">Subscribed animes will show up here</p>
      {/each}
    </svelte:fragment>
  </Section>
  {#if data.source.mainPage.topAiring}
    <Section storageId="{data.source.id}-new-episodes:scroll">
      <svelte:fragment slot="title">Top Airing</svelte:fragment>
      <svelte:fragment slot="animes">
        {#await data.topAiring.data}
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
        {:then topAiring}
          {#each topAiring as media, i}
            <AnimeCardSmall
              {media}
              source={data.source.id}
              delay={$settings.reduceMotion ? 0 : i * 100}
              on:click={() =>
                ($history.browse = [
                  media,
                  ...$history.browse.filter((item) => item.id !== media.id),
                ])}
            />
          {/each}
        {:catch error}
          <p>{error}</p>
        {/await}
      </svelte:fragment>
    </Section>
  {/if}
  <Section storageId="{data.source.id}-seasonal:scroll">
    <svelte:fragment slot="title">Seasonal</svelte:fragment>
    <svelte:fragment slot="animes">
      {#await data.seasonal.data}
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
        <Anime />
      {:then seasonal}
        {#each seasonal as media, i}
          <AnimeCardSmall
            {media}
            source={data.source.id}
            delay={$settings.reduceMotion ? 0 : i * 100}
            on:click={() =>
              ($history.browse = [
                media,
                ...$history.browse.filter((item) => item.id !== media.id),
              ])}
          />
        {/each}
      {:catch error}
        <p>{error}</p>
      {/await}
    </svelte:fragment>
  </Section>
</section>

<style>
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    margin: 1rem;
  }

  * {
    scrollbar-width: thin;
  }

  .selected {
    border-bottom: 2px solid var(--accent-color);
    text-decoration: none;
  }
</style>
