<script lang="ts">
  import Player from "$lib/player/Player.svelte";
  import { fade } from "svelte/transition";
</script>

<section transition:fade>
  <Player />
</section>

<style>
</style>
