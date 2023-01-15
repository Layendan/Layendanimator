<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  export let animes: any[];
  let current = 0;
  let interval = setInterval(() => {
    current = (current + 1) % animes.length;
  }, 10000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      clearInterval(interval);
      interval = setInterval(() => {
        current = (current + 1) % animes.length;
      }, 10000);
    } else {
      clearInterval(interval);
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div
  class="absolute inset-0 bg-gradient-to-b from-transparent to-base-100 z-10 pointer-events-none"
></div>
{#key current}
  <img
    in:fade|local="{{ duration: 1000 }}"
    class="w-full h-[45vh] object-cover"
    src="{animes[current].cover}"
    alt="{animes[current].english ?? animes[current].romaji}"
  />
{/key}
