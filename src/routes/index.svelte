<script script lang="ts">
  export const prerender = true;

  import { fade } from "svelte/transition";
  import Anime from "$lib/components/Anime.svelte";
  import { onMount } from "svelte";
  import { Shadow } from "svelte-loading-spinners";

  import { getAnimes } from "../lib/prefetch";

  const animes = [
    "Fate",
    "My Hero Academia",
    "Darling",
    "Your Name",
    "Hunter X Hunter",
  ];

  let list = [];
  // list = list;

  // Waiting for mounting to inject window
  // onMount(() => {
  //   list.forEach((element) => {
  //     element.data = searchAnime(element.title);
  //   });
  // });

  onMount(async () => {
    list = await getAnimes(animes);
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

<div transition:fade class="container">
  <!-- {#await list}
      <div class="center">
        <Shadow size="60" color="#895ef4" unit="px" duration="1s" />
      </div>
    {:then list} -->
  {#each list as section}
    <div
      id="animelist-{section.title.replaceAll(' ', '-').toLowerCase()}"
      class="anime-container"
      transition:fade
    >
      <hr class="solid" />
      <p class="title">{section.title}</p>
      <!-- change windows-scrollbar to check if running on windows -->
      <div class="items windows-scrollbar" transition:fade>
        {#each section.data as anime}
          <Anime
            name={anime.title.english
              ? anime.title.english
              : anime.title.romaji}
            thumbnail={anime.coverImage.large}
            banner={anime.bannerImage}
            link={anime.siteUrl}
            description={anime.description}
            episodes={anime.streamingEpisodes}
          />
        {/each}
      </div>
    </div>
  {:else}
    <div class="center">
      <Shadow size="60" color="#895ef4" unit="px" duration="1s" />
    </div>
  {/each}
  <!-- {/await} -->
</div>

<style>
  p {
    color: white;
  }

  .center {
    display: grid;
    place-items: center;
    height: 50vh;
  }
  .anime-container {
    margin-left: 10px;
    margin-right: 10px;
  }

  .items {
    overflow-x: scroll;
    overflow-y: visible;
    width: auto;
    white-space: nowrap;
    padding-bottom: 15px;
    /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75); */
  }

  .items::before {
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
  }

  .items::after {
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
  }

  .windows-scrollbar::-webkit-scrollbar {
    height: 0.5em;
  }

  .windows-scrollbar::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  .windows-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(169, 169, 169, 0.7);
    border-radius: 5px;
  }

  .windows-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(85, 85, 85, 0.7);
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
    border-top: 1px solid rgba(66, 66, 66, 0.5);
    border-color: #555;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }

  .container {
    padding: 2rem;
    margin-top: 3rem;

    transition: all 0.2s ease-in-out;
  }
</style>
