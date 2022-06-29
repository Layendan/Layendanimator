<script script lang="ts">
  export const prerender = true;

  import { fade } from "svelte/transition";
  import Anime from "$lib/components/Anime.svelte";
  import { onMount } from "svelte";
  import { getAnimes } from "../lib/prefetch";
  import { settings } from "../model/settings";

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

  let list: any = [];

  // Have to wait until __Tauri__ gets injected
  onMount(() => {
    list = getAnimes(animes);
  });

  // Have to wait until __Tauri__ gets injected
  // onMount(() => {
  // 	// Sends notification to user
  // 	window.__TAURI__.notification.isPermissionGranted().then((value) => {
  // 		if (value === true) {
  // 			window.__TAURI__.notification.sendNotification({ title: 'Hello', body: 'Hello World' });
  // 		} else {
  // 			window.__TAURI__.notification.requestPermission().then((value) => {
  // 				if (value === 'granted') {
  // 					window.__TAURI__.notification.sendNotification({ title: 'Hello', body: 'Hello World' });
  // 				}
  // 			});
  // 		}
  // 	});
  // });
</script>

<svelte:head>
  <title>Layendanimator</title>
</svelte:head>

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
              {#if $settings.allowNSFW || !anime.isAdult}
                <Anime
                  name={anime.title.english
                    ? anime.title.english
                    : anime.title.romaji}
                  thumbnail={anime.coverImage.large}
                  banner={anime.bannerImage}
                  link={anime.siteUrl}
                  description={anime.description}
                  episodes={anime.streamingEpisodes}
                  isNSFW={anime.isAdult}
                />
              {/if}
            {/each}
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

  /* Removing the shadows because I don't think they're needed, just commented out though in case I want to add it again */

  /* .items::before {
    content: "";
    position: absolute;
    z-index: 1;
    top: 0;
    left: 2rem;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(
      to right,
      rgba(51, 51, 51, 1) 0%,
      rgba(51, 51, 51, 0) 2%
    );
  } */

  /* .items::after {
    content: "";
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 2rem;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(
      to right,
      rgba(51, 51, 51, 0) 98%,
      rgba(51, 51, 51, 1) 100%
    );
  } */

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
