<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { settings } from '$lib/model/settings';
  import { fade } from 'svelte/transition';

  export let anime: Anime;
  $: heroLoaded = true;

  let scrollY: number;
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {Math.max(scrollY / 1.5, 0)}px, 0);"
  class:!translate3d-y-0={!$settings.parallax}
  in:fade={{ duration: 200 }}
>
  <img
    class="skeleton h-[38vh] w-full object-cover object-top"
    src={heroLoaded
      ? anime.cover ?? anime.image
      : '/assets/loading_failure.jpeg'}
    on:error={() => (heroLoaded = false)}
    alt="{anime.title.english ?? anime.title.romaji} Cover"
  />
  <div class="scrim pointer-events-none absolute inset-0" />
</header>
