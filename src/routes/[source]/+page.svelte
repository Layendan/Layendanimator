<script lang="ts">
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
  import { invalidate } from "$app/navigation";
  import Carousel from "$lib/components/carousel/Carousel.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.source.name}</title>
</svelte:head>

<svelte:window
  on:keydown={(event) => {
    if (event.key === "r" && (event.ctrlKey || event.metaKey)) {
      invalidate(data.source.id);
      event.preventDefault();
    }
  }}
/>

<section>
  <!-- TODO: Change this div to header and change header to flex -->
  <header>
    <div class="sources">
      {#each $activeSources as source}
        <a
          href={source.id}
          class:selected={source.id === data.source.id}
          data-sveltekit-preload-data
        >
          {capitalize(source.name)}
        </a>
      {/each}
    </div>
    <SearchBar source={data.source} />
  </header>
  {#await data.topAiring.data}
    <div class="loading" />
  {:then medias}
    <Carousel source={data.source.id} {medias} />
  {:catch}
    <div class="error__padding" />
  {/await}
  {#if data.source.mainPage.recentEpisodes}
    <Section storageId="{data.source.id}-new-episodes:scroll">
      <svelte:fragment slot="title">New Episodes</svelte:fragment>
      <svelte:fragment slot="animes">
        {#await data.recentEpisodes.data}
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
          <AnimeCardSmall />
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
  <Section storageId="{data.source.id}-seasonal:scroll">
    <svelte:fragment slot="title">Popular</svelte:fragment>
    <svelte:fragment slot="animes">
      {#await data.popular.data}
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
        <AnimeCardSmall />
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
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 20;
    background: linear-gradient(
      to bottom,
      rgba(var(--primary-rgb), 1) 20%,
      rgba(var(--primary-rgb), 0) 100%
    );
  }

  .sources {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    margin: 1rem;
  }

  .selected {
    border-bottom: 2px solid var(--accent-color);
    text-decoration: none;
  }

  .loading {
    height: 70vh;
    width: 100%;
    background: linear-gradient(
        to right,
        rgba(var(--primary-rgb), 0.8) 0%,
        rgba(var(--primary-rgb), 0) 2%,
        rgba(var(--primary-rgb), 0) 98%,
        rgba(var(--primary-rgb), 0.8) 100%
      ),
      linear-gradient(
        to bottom,
        rgba(var(--primary-rgb), 1) 0%,
        rgba(var(--primary-rgb), 0) 10%,
        rgba(var(--primary-rgb), 0) 90%,
        rgba(var(--primary-rgb), 1) 100%
      ),
      radial-gradient(
        ellipse at 80%,
        rgba(var(--primary-rgb), 0) 0%,
        rgba(var(--primary-rgb), 0.7) 50%,
        rgba(var(--primary-rgb), 1) 95%
      ),
      url("/assets/loading_failure.jpeg");
    background-repeat: none;
    background-size: cover;
    background-position: center;
  }

  .error__padding {
    height: 7rem;
  }
</style>
