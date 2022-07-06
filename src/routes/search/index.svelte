<script lang="ts">
  import { page } from "$app/stores";
  import SearchAnime from "$lib/components/SearchAnime.svelte";
  import type { Anime } from "$lib/model/anime";
  import { connections } from "$lib/model/connections";
  import { searchAnime } from "$lib/prefetch";
  import { onDestroy } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import { fade } from "svelte/transition";

  let query: string = $page.url.searchParams.get("search")
    ? $page.url.searchParams.get("search")
    : "";

  async function getAnimes(): Promise<Anime[]> {
    return $connections["anilist"]
      ? searchAnime(query, $connections["anilist"])
      : searchAnime(query);
  }

  let animes: Promise<Anime[]> = getAnimes();

  // Have to listen to changes since the page does not reload
  const unsubscribe: Unsubscriber = page.subscribe(() => {
    if (
      $page.url.searchParams.get("search") &&
      query !== $page.url.searchParams.get("search")
    ) {
      query = $page.url.searchParams.get("search");
      animes = getAnimes();
    }
  });

  onDestroy(unsubscribe);
</script>

<main transition:fade>
  {#await animes then animeArray}
    {#each animeArray as anime}
      <hr class="solid" />
      <SearchAnime
        title={anime.title.english ? anime.title.english : anime.title.romanji}
        link={anime.siteUrl}
        description={anime.description}
        thumbnail={anime.coverImage.large}
        banner={anime.bannerImage}
        ratings={anime.averageScore}
        genres={anime.genres}
        isNSFW={anime.isAdult}
      />
    {:else}
      <p class="center">No results found</p>
    {/each}
  {:catch}
    <p class="center">Something went wrong, Please try again later</p>
  {/await}
</main>

<style>
  main {
    display: list-item;
    list-style: none;
    vertical-align: top;
    width: 100%;
    margin-top: 1rem;
    transform: translateY(3em);
  }
  hr.solid {
    margin-top: 20px;
    margin-bottom: 20px;
    border-top: 1px solid rgba(66, 66, 66, 0.5);
    border-color: #555;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }

  .center {
    text-align: center;
  }
</style>
