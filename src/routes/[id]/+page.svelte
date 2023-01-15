<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<header class="relative m-[-1rem] mb-4">
  <div
    class="absolute inset-0 bg-gradient-to-b from-transparent to-base-100"
  ></div>
  <img
    class="w-full h-[38vh] object-cover object-top"
    src="{data.cover ?? data.image}"
    alt="{data.title.english ?? data.title.romaji} Cover"
  />
</header>

<section in:fade class="relative prose">
  <h1>{data.title.english ?? data.title.romaji}</h1>
  <p>{@html data.description}</p>
</section>
