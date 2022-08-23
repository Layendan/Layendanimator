<script lang="ts">
  import Episode from "./Episode.svelte";
  import { settings } from "$lib/model/settings";
  import type { Episode as EpisodeType } from "$lib/model/anime";

  export let episodes: EpisodeType[] = [];
  export let hoverAll: boolean = false;
</script>

<!-- vertically lists all of the episodes -->
<ul>
  {#each $settings.ordered ? episodes : [...episodes].reverse() as episode}
    <li>
      <Episode {episode} hover={hoverAll} />
    </li>
  {/each}
</ul>

<style>
  ul {
    display: flex;
    flex-direction: column;
    /* https://developer.mozilla.org/en-US/docs/Web/CSS/list-style */
    list-style: none;
    margin: 0;
    padding: 0;
    padding-top: 1em;
  }
</style>
