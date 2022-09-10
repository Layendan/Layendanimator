<script lang="ts">
  import Anime from "$lib/components/Anime.svelte";
  import Section from "$lib/components/Section.svelte";
  import JsSandbox, {
    getRecentEpisodes,
    getTopAiring,
  } from "$lib/components/JsSandbox.svelte";
  import { history } from "$lib/model/history";
  import { library } from "$lib/model/library";
  import type { Anime as AnimeType } from "$lib/model/anime";
  import { activeSources } from "$lib/model/sources";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import { capitalize } from "$lib/model/global";

  let isSanboxLoaded: boolean = false;
  $: query = "";

  export let data: PageData;

  async function preloadRecentEpisodes(): Promise<
    { episode: number; media: AnimeType }[]
  > {
    const episodes = await getRecentEpisodes();
    return episodes;
  }

  async function preloadTopAiring(): Promise<AnimeType[]> {
    const topAiring = await getTopAiring();
    return topAiring;
  }
</script>

<JsSandbox
  jsFile={data.source.srcPath}
  on:load={() => (isSanboxLoaded = true)}
/>

<section>
  <header>
    {#each $activeSources as source}
      <a href={source.id} class:selected={source.id === data.source.id}>
        {capitalize(source.name)}
      </a>
    {/each}
  </header>
  <form
    on:submit|preventDefault={() => {
      if (!$history.search.includes(query))
        $history.search = [...$history.search, query];
      goto(`/${data.source.id}/search?search=${query}`);
    }}
  >
    <input
      type="search"
      placeholder="Search"
      class="search"
      autocapitalize="words"
      list="searchRec"
      bind:value={query}
    />
    <datalist id="searchRec">
      {#each $history.search as option}
        <option value={option}>{option}</option>
      {/each}
    </datalist>
  </form>
  {#if data.source.mainPage.recentEpisodes}
    <Section storageId="{data.source.id}-new-episodes:scroll">
      <svelte:fragment slot="title">New Episodes</svelte:fragment>
      <svelte:fragment slot="animes">
        {#if isSanboxLoaded}
          {#await preloadRecentEpisodes()}
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
            {#each recentEpisodes as { episode, media }}
              <Anime
                {media}
                {episode}
                source={data.source.id}
                on:click={() =>
                  ($history.browse = [
                    media,
                    ...$history.browse.filter((item) => item.id !== media.id),
                  ])}
              />
            {/each}
          {/await}
        {:else}
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
        {/if}
      </svelte:fragment>
    </Section>
  {/if}
  <Section storageId="Subscriptions:scroll">
    <svelte:fragment slot="title">Subscriptions</svelte:fragment>
    <svelte:fragment slot="animes">
      {#each $library.subscriptions as { media, source }}
        {#if source}
          <Anime
            {media}
            source={source.id}
            on:click={() =>
              ($history.browse = [
                media,
                ...$history.browse.filter((item) => item.id !== media.id),
              ])}
          />
        {:else}
          <Anime
            {media}
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
        {#if isSanboxLoaded}
          {#await preloadTopAiring()}
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
            {#each topAiring as media}
              <Anime
                {media}
                source={data.source.id}
                on:click={() =>
                  ($history.browse = [
                    media,
                    ...$history.browse.filter((item) => item.id !== media.id),
                  ])}
              />
            {/each}
          {/await}
        {:else}
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
        {/if}
      </svelte:fragment>
    </Section>
  {/if}
</section>

<style>
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    margin-top: 4rem;
    margin-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  * {
    scrollbar-width: thin;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }

  .search {
    background-color: transparent;
    width: 90%;
    color: var(--text-color);
    accent-color: var(--accent-color);
    -webkit-appearance: textfield;
  }

  .selected {
    border-bottom: 2px solid var(--accent-color);
    text-decoration: none;
  }

  input:focus {
    outline: 2px solid var(--accent-color);
  }
</style>
