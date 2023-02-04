<script lang="ts">
  import 'vidstack/styles/base.css';
  // the following styles are optional - remove to go headless.
  import 'vidstack/styles/ui/buttons.css';
  import 'vidstack/styles/ui/sliders.css';
  // the `.js` extension is required.
  import 'vidstack/define/media-player.js';
  import { defineCustomElements } from 'vidstack/elements';
  import { onMount } from 'svelte';
  import Cpu from './svg/Cpu.svelte';

  export let sources: {
    url: string;
    isM3U8: boolean;
    quality: string;
  }[];
  export let poster: string;

  let selectedSource = 0;

  onMount(async () => {
    await defineCustomElements();
  });
</script>

<div class="relative w-screen h-auto bg-black -m-4 mb-4">
  <media-player
    src={sources[selectedSource].url}
    {poster}
    controls
    aspect-ratio="16/9"
    class="block w-[max(calc(800px),70vw)] mx-auto object-cover"
    preload="metadata"
  >
    <media-outlet />
  </media-player>
  <div class="bottom-4 left-4 absolute">
    <div class="dropdown dropdown-right dropdown-end">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <label
        tabindex="0"
        class="btn btn-outline btn-accent bg-black bg-opacity-40 backdrop-blur-lg w-fit"
      >
        <Cpu height={20} width={20} />
      </label>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content z-10 p-2 ml-2 shadow bg-base-200 rounded-box w-52"
      >
        {#each sources as source, i}
          <li class="m-1">
            <button
              class="btn btn-outline btn-accent w-full items-center"
              disabled={selectedSource === i}
              on:click={() => (selectedSource = i)}
            >
              {source.quality}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
