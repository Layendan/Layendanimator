<script lang="ts">
  import SearchAnime from "$lib/components/SearchAnime.svelte";
  import type { Anime } from "$lib/model/anime";
  import { settings } from "$lib/model/settings";
  import { history } from "$lib/model/history";
  import { fade } from "svelte/transition";
  import JsSandbox, { searchAnime } from "$lib/components/JsSandbox.svelte";
  import type { PageData } from "./$types";
  import Loading from "$lib/components/public/Loading.svelte";

  export let data: PageData;
  let isSanboxLoaded: boolean = false;

  async function getAnimes(): Promise<Anime[]> {
    let anime =
      JSON.parse(
        window?.sessionStorage.getItem(`${data.query}-search`) ?? "null"
      ) ?? (await searchAnime(data.query));
    window?.sessionStorage.setItem(
      `${data.query}-search`,
      JSON.stringify(anime)
    );
    return anime;
  }
</script>

<JsSandbox
  jsFile={data.source.srcPath}
  on:load={() => (isSanboxLoaded = true)}
/>

{#if isSanboxLoaded}
  {#await getAnimes()}
    <Loading />
  {:then animeArray}
    <main in:fade>
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
    </main>
  {:catch e}
    <p class="center">{e}</p>
  {/await}
{:else}
  <Loading />
{/if}

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
