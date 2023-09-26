<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { settings } from '$lib/model/settings';
  import { fade } from 'svelte/transition';

  export let anime: Anime;
  export let removeParallax = false;

  let heroLoaded = true;
  let skeleton = true;

  $: if (anime.cover) {
    heroLoaded = true;
    skeleton = true;
  }

  let scrollY: number;
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 w-[calc(100vw-0.5rem)] motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {Math.max(scrollY / 1.5, 0)}px, 0);"
  class:!translate3d-y-0={!$settings.parallax || removeParallax}
>
  {#key anime.id}
    <img
      src={heroLoaded
        ? anime.cover ?? anime.image
        : '/assets/loading_failure.jpeg'}
      alt="{anime.title.english ?? anime.title.romaji} Cover"
      on:error|once={() => (heroLoaded = false)}
      on:load|once={() => (skeleton = false)}
      in:fade={{ duration: 200 }}
      class="h-[38vh] w-full object-cover object-top"
      class:skeleton
    />
  {/key}
  <div class="scrim pointer-events-none absolute inset-0 translate-y-1" />
</header>
