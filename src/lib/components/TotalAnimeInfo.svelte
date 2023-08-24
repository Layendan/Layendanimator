<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { fade } from 'svelte/transition';
  import AnimeInfo from './AnimeInfo.svelte';
  import ExternalAnimeCard from './ExternalAnimeCard.svelte';
  import SubscribeButton from './SubscribeButton.svelte';

  export let anime: Anime;
</script>

<section
  in:fade
  class="mx-auto grid grid-cols-[240px_auto] grid-rows-1 gap-x-4 transition-[grid-template-columns] duration-200 lg:grid-cols-[300px_auto]"
>
  <div class="relative m-0 -mt-[20vh]">
    <ExternalAnimeCard {anime} />
    <SubscribeButton {anime} />
  </div>

  <AnimeInfo {anime} />
</section>
