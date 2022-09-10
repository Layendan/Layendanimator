<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import { fetch, ResponseType, type HttpOptions } from "@tauri-apps/api/http";
  import { activeSources } from "$lib/model/sources";
  import Anime from "$lib/components/Anime.svelte";

  /**
   * Import a source from a github link.
   */
  async function importSource(link: string) {
    alert(link);

    // const response = await fetch(link);
    // const data = await response.json();

    const options: HttpOptions = {
      url: link,
      method: "GET",
      timeout: { secs: 30, nanos: 0 },
      responseType: ResponseType.Text,
    };

    let response;

    try {
      response = await fetch(link, options);

      console.log(response);
      console.log(response.data);
    } catch (e) {
      console.error(e);
      return;
    }

    // TODO: Replace id with link data
    if ($activeSources.find((source) => source.id === "test")) {
      alert("Source already exists");
      return;
    }

    $activeSources = [
      {
        id: "test",
        name: "test",
        version: "0.0.1",
        baseUrl: link,
        srcPath: "/layendanimator-base/crunchyroll/source.js",
        contentRating: "EVERYONE",
        desc: "test",
        tags: [],
        icon: "",
        author: "me",
        repo: link,
        website: link,
        mainPage: {
          recentEpisodes: true,
          topAiring: true,
        },
      },
      ...$activeSources,
    ];
  }

  export let sourceLink: string = "";
  export let placeholder: string = "Source Link";
</script>

<form
  on:submit|preventDefault={() => {
    if (sourceLink.length > 0) importSource(sourceLink);
  }}
  autocomplete="off"
>
  <input
    title="Please enter a link to a github source"
    type="url"
    {placeholder}
    bind:value={sourceLink}
    autocomplete="false"
  />
  <Button>Add Source</Button>
</form>

<style>
  input {
    width: 100%;
    background-color: transparent;
    color: var(--text-color);
    accent-color: var(--accent-color);
    -webkit-appearance: textfield;
  }

  input:focus {
    outline: 2px solid var(--accent-color);
  }

  input:invalid {
    outline: 2px solid var(--danger-color);
  }
</style>
