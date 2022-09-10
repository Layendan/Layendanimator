<script script lang="ts">
  import { fade } from "svelte/transition";
  import Anime from "$lib/components/Anime.svelte";
  import Section from "$lib/components/Section.svelte";
  import { settings } from "$lib/model/settings";
  import { history } from "$lib/model/history";
  import { library } from "$lib/model/library";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: query = "";
</script>

<svelte:head>
  <title>Layendanimator</title>
</svelte:head>

<div class="container" in:fade>
  <form
    on:submit|preventDefault={() => {
      if (!$history.search.includes(query))
        $history.search = [...$history.search, query];
      goto(`/search?search=${query}`);
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
  {#await data.list}
    <!-- Replace with something cooler -->
    Loading...
  {:then { airing, recommended, season, trending }}
    <Section storageId="{airing.title}:scroll">
      <svelte:fragment slot="title">
        {airing.title}
      </svelte:fragment>
      <svelte:fragment slot="animes">
        {#each airing.data as { airingAt, episode, media }}
          {#if !media.isAdult || $settings.allowNSFW}
            <Anime
              {media}
              {episode}
              {airingAt}
              on:click={() =>
                ($history.browse = [
                  media,
                  ...$history.browse.filter((item) => item.id !== media.id),
                ])}
            />
          {/if}
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
        {/each}
      </svelte:fragment>
    </Section>
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
    <Section storageId="{recommended.title}:scroll">
      <svelte:fragment slot="title">
        {recommended.title}
      </svelte:fragment>
      <svelte:fragment slot="animes">
        {#each recommended.data as anime}
          {#if !anime.isAdult || $settings.allowNSFW}
            <Anime
              media={anime}
              on:click={() =>
                ($history.browse = [
                  anime,
                  ...$history.browse.filter((item) => item.id !== anime.id),
                ])}
            />
          {/if}
        {:else}
          <p class="sub-placeholder">No Recommendations</p>
        {/each}
      </svelte:fragment>
    </Section>
    <Section storageId="{season.title}:scroll">
      <svelte:fragment slot="title">
        {season.title}
        <br />
        <h3>
          {data.date.getFullYear()}
          {data.season}
        </h3>
      </svelte:fragment>
      <svelte:fragment slot="animes">
        {#each season.data as anime}
          {#if !anime.isAdult || $settings.allowNSFW}
            <Anime
              media={anime}
              on:click={() =>
                ($history.browse = [
                  anime,
                  ...$history.browse.filter((item) => item.id !== anime.id),
                ])}
            />
          {/if}
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
        {/each}
      </svelte:fragment>
    </Section>
    <Section storageId="{trending.title}:scroll">
      <svelte:fragment slot="title">
        {trending.title}
        <br />
        <h3>
          {data.date.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
      </svelte:fragment>
      <svelte:fragment slot="animes">
        {#each trending.data as anime}
          {#if !anime.isAdult || $settings.allowNSFW}
            <Anime
              media={anime}
              on:click={() =>
                ($history.browse = [
                  anime,
                  ...$history.browse.filter((item) => item.id !== anime.id),
                ])}
            />
          {/if}
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
        {/each}
      </svelte:fragment>
    </Section>
  {:catch e}
    {e}
  {/await}
</div>

<style>
  * {
    scrollbar-width: thin;
  }

  p {
    color: var(--text-color);
  }

  h3 {
    color: var(--text-color);
    opacity: 0.6;
    font-size: small;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  .sub-placeholder {
    margin-left: 1rem;
    font-style: italic;
    font-size: large;
    font-weight: lighter;
  }

  .container {
    padding: 2rem;
    margin-top: 3rem;
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

  input:focus {
    outline: 2px solid var(--accent-color);
  }
</style>
