<script lang="ts">
  import SearchAnime from "$lib/components/SearchAnime.svelte";
  import { settings } from "$lib/model/settings";
  import { history } from "$lib/model/history";
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import Loading from "$lib/components/public/Loading.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import { capitalize } from "$lib/model/global";

  export let data: PageData;
</script>

<main in:fade>
  <SearchBar source={data.source} query={data.query} />
  <h1>Results for - <i>{capitalize(data.query)}</i></h1>
  {#await data.search.data}
    <Loading />
  {:then animeArray}
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
          source={data.source}
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
  {:catch e}
    <p class="center">{e}</p>
  {/await}
</main>

<style>
  main {
    display: list-item;
    list-style: none;
    vertical-align: top;
    width: 100%;
  }

  h1 {
    margin-left: 1rem;
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
