<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import { fetch, ResponseType, type HttpOptions } from "@tauri-apps/api/http";
  import { activeSources } from "$lib/model/sources";
  import { invalidate } from "$app/navigation";

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
    invalidate("na:/");
  }

  export let sourceLink: string = "";
  let input: HTMLInputElement;
</script>

<form
  on:submit|preventDefault={() => {
    if (sourceLink.length > 0) importSource(sourceLink);
  }}
  on:click={() => input?.focus()}
  autocomplete="off"
  title="Please enter a link to a github source"
>
  <input
    type="url"
    placeholder="Source link"
    autocomplete="off"
    bind:value={sourceLink}
    bind:this={input}
  />
  <Button>Add Source</Button>
</form>

<style>
  form {
    display: flex;
    width: 100%;
    flex-direction: row;
    padding: 0.5rem;
    padding-bottom: 0.2rem;
    align-items: center;
    background-color: var(--primary-color);
    border-radius: 5px;
    border: 1px solid transparent;
    cursor: text;
    transition: border-color 0.2s ease-in-out;
  }
  input {
    width: 92%;
    background-color: transparent;
    color: var(--text-color);
    accent-color: var(--accent-color);
    outline: none;
    border: none;
    -webkit-appearance: textfield;
  }

  form:hover,
  form:focus-within {
    border-color: var(--tertiary-color);
  }

  form:invalid {
    border-color: var(--danger-color);
  }
</style>
