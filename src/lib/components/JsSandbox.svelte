<script context="module" lang="ts">
  let iframe: HTMLIFrameElement;

  export async function getRecentEpisodes(): Promise<
    { episode: number; media: Anime }[]
  > {
    // @ts-ignore
    const data = await iframe?.contentWindow?.getRecentEpisodes?.();
    console.log(data);
    return data;
  }

  export async function getTopAiring(): Promise<Anime[]> {
    // @ts-ignore
    const data = await iframe?.contentWindow?.getTopAiring?.();
    console.log(data);
    return data;
  }

  export async function getAnime(id: string): Promise<Anime> {
    // @ts-ignore
    const data = await iframe?.contentWindow?.getAnime?.(id);
    console.log(data);
    return data;
  }

  export async function getStreamingLinks(id: string): Promise<Mirror[]> {
    // @ts-ignore
    const data = await iframe?.contentWindow?.getStreamingLinks?.(id);
    console.log(data);
    return data;
  }

  export async function searchAnime(query: string): Promise<Anime[]> {
    // @ts-ignore
    const data = await iframe?.contentWindow?.searchAnime?.(query);
    console.log(data);
    return data;
  }
</script>

<script lang="ts">
  import type { Anime, Mirror } from "$lib/model/anime";

  export let jsFile: string;
</script>

<!-- Have to make srcdoc look weird because of formatting and parsing issues -->
<iframe
  on:load
  bind:this={iframe}
  srcdoc={`<${"script"} type="text/javascript" src="${jsFile}"><${"/script"}>`}
  title="source-frame"
  name="source"
  sandbox="allow-scripts allow-same-origin"
/>

<style>
  iframe {
    display: none;
  }
</style>
