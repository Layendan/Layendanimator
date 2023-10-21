<script lang="ts">
  import { scrollY } from '$lib/model/cache';
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
</script>

<header
  class="relative mb-2 h-[38vh] w-full overflow-hidden will-change-transform motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {$scrollY / 1.5}px, 0);"
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
      class="h-full w-full object-cover object-top"
      class:skeleton
    />
  {/key}
  <div class="scrim pointer-events-none absolute inset-0" />
</header>
