<script script lang="ts">
  import { fade } from "svelte/transition";
  import Anime from "$lib/components/Anime.svelte";
  import Section from "$lib/components/Section.svelte";
  import { settings } from "$lib/model/settings";
  import { history } from "$lib/model/history";
  import { library } from "$lib/model/library";
  import type { PageData } from ".svelte-kit/types/src/routes/$types";

  export let data: PageData;

  let source: HTMLIFrameElement;
  const script: string = `function testFunction() {return "Hello World";}`;
  const csp: string = `default-src 'self' ${""};`;

  /**
   * This function returns an HTML string to be used withing the srcdoc of an iframe.
   * @param csp The CSP to use.
   * @param script The script to inject.
   * @returns A formatted HTML string.
   */
  function getSrcDoc(script: string, csp: string): string {
    return `<meta https-equiv="Content-Security-Policy" content="${csp}" /><script>${script}<\/script>`;
  }
</script>

<svelte:head>
  <title>Layendanimator</title>
</svelte:head>

<iframe
  on:load={() => {
    // @ts-ignore
    console.log(source.contentWindow.testFunction?.());
  }}
  bind:this={source}
  srcdoc={getSrcDoc(script, csp)}
  title="source-frame"
  name="source"
/>

<div class="container" in:fade>
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
              id={media.id}
              name={$settings.animeLanguage === "english"
                ? media.title.english ?? media.title.romaji
                : media.title.native ?? media.title.romaji}
              thumbnail={media.coverImage.large}
              {episode}
              {airingAt}
              description={media.description}
              episodes={media.streamingEpisodes}
              isNSFW={media.isAdult}
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
        {#each $library.subscriptions as anime}
          {#if !anime.isAdult || $settings.allowNSFW}
            <Anime
              id={anime.id}
              name={$settings.animeLanguage === "english"
                ? anime.title.english ?? anime.title.romaji
                : anime.title.native ?? anime.title.romaji}
              thumbnail={anime.coverImage.large}
              description={anime.description}
              episodes={anime.streamingEpisodes}
              isNSFW={anime.isAdult}
              on:click={() =>
                ($history.browse = [
                  anime,
                  ...$history.browse.filter((item) => item.id !== anime.id),
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
              id={anime.id}
              name={$settings.animeLanguage === "english"
                ? anime.title.english ?? anime.title.romaji
                : anime.title.native ?? anime.title.romaji}
              thumbnail={anime.coverImage.large}
              description={anime.description}
              episodes={anime.streamingEpisodes}
              isNSFW={anime.isAdult}
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
              id={anime.id}
              name={$settings.animeLanguage === "english"
                ? anime.title.english ?? anime.title.romaji
                : anime.title.native ?? anime.title.romaji}
              thumbnail={anime.coverImage.large}
              description={anime.description}
              episodes={anime.streamingEpisodes}
              isNSFW={anime.isAdult}
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
              id={anime.id}
              name={$settings.animeLanguage === "english"
                ? anime.title.english ?? anime.title.romaji
                : anime.title.native ?? anime.title.romaji}
              thumbnail={anime.coverImage.large}
              description={anime.description}
              episodes={anime.streamingEpisodes}
              isNSFW={anime.isAdult}
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

  iframe {
    display: none;
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
</style>
