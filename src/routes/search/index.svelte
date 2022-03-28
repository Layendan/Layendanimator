<script lang="ts">
  import { page } from "$app/stores";
  import Anime from "$lib/components/Anime.svelte";
  import { searchAnime } from "$lib/prefetch";
  import { fade } from "svelte/transition";

  let query: string = $page.url.searchParams.get("search")
    ? $page.url.searchParams.get("search")
    : "";
  let animes: any = [];

  animes = searchAnime(query);

  console.log(animes);

  // Have to listen to changes since the page does not reload
  page.subscribe(() => {
    query = $page.url.searchParams.get("search")
      ? $page.url.searchParams.get("search")
      : "";

    animes = searchAnime(query);
  });
</script>

<main transition:fade>
  {#await animes}
    <progress style="accent-color: #895ef4;" />
  {:then animeData}
    {#each animeData as anime}
      <Anime
        name={anime.title.english ? anime.title.english : anime.title.romaji}
        thumbnail={anime.coverImage.large}
        banner={anime.bannerImage}
        link={anime.siteUrl}
        description={anime.description}
        episodes={anime.streamingEpisodes}
      />
    {/each}
  {/await}
</main>

<style>
  main {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
    row-gap: 1rem;
    margin-top: 1rem;
    transform: translateY(3em);
  }
</style>
