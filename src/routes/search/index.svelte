<script lang="ts">
  import { page } from "$app/stores";
  import SearchAnime from "$lib/components/SearchAnime.svelte";
  import { animes as animesStore, type Anime } from "$lib/model/anime";
  import { connections } from "$lib/model/connections";
  import { settings } from "$lib/model/settings";
  import { history } from "$lib/model/history";
  import { searchAnime } from "$lib/prefetch";
  import { onDestroy } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import { fade } from "svelte/transition";

  let query: string = $page.url.searchParams.get("search")
    ? $page.url.searchParams.get("search")
    : "";

  async function getAnimes(): Promise<Anime[]> {
    let anime = searchAnime(query, $connections["anilist"]);
    // Using .then as to not block function
    anime.then((tempAnime) =>
      tempAnime.forEach((item) => {
        if (!$animesStore.has(item.id)) animesStore.addAnime(item);
      })
    );
    return anime;
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
      {#if !anime.isAdult || $settings.allowNSFW}
        <hr class="solid" />
        <SearchAnime
          id={anime.id}
          title={$settings.animeLanguage === "english"
            ? anime.title.english ?? anime.title.romaji
            : anime.title.native ?? anime.title.romaji}
          description={anime.description}
          thumbnail={anime.coverImage.large}
          ratings={anime.averageScore}
          genres={anime.genres}
          isNSFW={anime.isAdult}
          on:click={() =>
            ($history.browse = [
              anime,
              ...$history.browse.filter((item) => item.id !== anime.id),
            ])}
        />
      {/if}
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
