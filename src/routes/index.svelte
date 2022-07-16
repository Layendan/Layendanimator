<script script lang="ts">
  export const prerender = true;

  import { fade } from "svelte/transition";
  import Anime from "$lib/components/Anime.svelte";
  import { onMount } from "svelte";
  import { getAnimes } from "../lib/prefetch";
  import { getSrcDoc } from "$lib/model/global";
  import { settings } from "$lib/model/settings";
  import type { Anime as AnimeType } from "$lib/model/anime";
  import { connections } from "$lib/model/connections";
  import { history } from "$lib/model/history";
  import { animes as animesStore } from "$lib/model/anime";

  // 429 Error, too many requests
  const animes = [
    "Fate",
    "My Hero Academia",
    "Darling",
    "Your Name",
    "Hunter X Hunter",
    "One Piece",
    "One Punch",
    "Attack on Titan",
    "Death Parade",
    "Fullmetal Alchemist",
    "Jujutsu Kaisen",
    "Naruto",
    "Bleach",
    "Platinum End",
    "Vanitas no Carte",
    "Sword Art Online",
    "Ping Pong",
    "Peach Boy",
    "Star Wars",
    "Re:CREATORS",
    "Evangelion",
    "Sahate No Paladin",
  ];

  let list: { title: string; data: Promise<AnimeType[]> }[] = [];

  let source: HTMLIFrameElement;

  const script: string = `function testFunction() {return "Hello World";}`;
  const csp: string = `default-src 'self' ${""};`;

  onMount(() => {
    list = getAnimes(animes, $connections["anilist"]);

    list.forEach(async (data) =>
      (await data.data).forEach((anime) => {
        if (!$animesStore.has(anime.id)) animesStore.addAnime(anime);
      })
    );
  });
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

<div class="container" transition:fade>
  {#await list}
    {#each animes as anime}
      <div
        id="animelist-{anime.replaceAll(' ', '-').toLowerCase()}"
        class="anime-container"
        transition:fade
      >
        <hr class="solid" />
        <p class="title">{anime}</p>
        <!-- change windows-scrollbar to check if running on windows -->
        <div class="items windows-scrollbar" transition:fade>
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
          <Anime />
        </div>
      </div>
    {/each}
  {:then list}
    {#each list as section}
      <div
        id="animelist-{section.title.replaceAll(' ', '-').toLowerCase()}"
        class="anime-container"
      >
        <hr class="solid" />
        <p class="title">{section.title}</p>
        <!-- change windows-scrollbar to check if running on windows -->
        <div class="items windows-scrollbar" transition:fade>
          {#await section.data}
            <Anime />
            <Anime />
            <Anime />
            <Anime />
            <Anime />
            <Anime />
            <Anime />
            <Anime />
            <Anime />
          {:then parsedAnimes}
            {#each parsedAnimes as anime}
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
            {/each}
          {:catch}
            <p style="margin-left: 1rem;">Error Fetching Episodes</p>
          {/await}
        </div>
      </div>
    {/each}
  {/await}
</div>

<style>
  * {
    scrollbar-width: thin;
  }

  p {
    /* color: white; */
    color: var(--text-color);
  }

  iframe {
    display: none;
  }

  .anime-container {
    margin-left: 10px;
    margin-right: 10px;
  }

  .items {
    display: inline-flexbox;
    overflow-x: auto;
    overflow-y: hidden;
    width: auto;
    white-space: nowrap;
    padding-bottom: 15px;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
  }

  .windows-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--text-color) var(--tertiary-color);
  }

  .windows-scrollbar::-webkit-scrollbar {
    height: 7px;
    border-radius: 100px;
  }
  .windows-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(var(--pure-white-rgb), 0.7);
    background-clip: padding-box;
    border-radius: 100px;
    border: 2px, solid, transparent;
  }

  .windows-scrollbar::-webkit-scrollbar-track {
    background-color: rgba(var(--tertiary-rgb), 0.7);
  }

  .windows-scrollbar::-webkit-scrollbar-thumb:active {
    background: rgba(
      var(--pure-white-rgb),
      0.61
    ); /* Some darker color when you click it */
    border-radius: 100px;
  }

  .windows-scrollbar::-webkit-scrollbar-track:hover {
    background-color: rgba(var(--secondary-rgb), 0.7);
  }

  .title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 12px;
    z-index: 3;
    position: relative;
  }

  hr.solid {
    margin-top: 20px;
    border-top: 1px solid;
    border-color: var(--secondary-color);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }

  .container {
    padding: 2rem;
    margin-top: 3rem;
  }
</style>
