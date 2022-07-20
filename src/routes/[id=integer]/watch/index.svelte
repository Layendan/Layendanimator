<script lang="ts">
  import Player from "$lib/components/player/Player.svelte";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";
  import type { Episode } from "$lib/model/anime";

  let episode: Episode = JSON.parse($page.url.searchParams.get("episode"));
</script>

<section transition:fade>
  <Player {episode} />
</section>

<style>
</style>
