<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Character } from '../model/classes/Anime';

  export let character: Character;
  export let color: string | undefined = undefined;

  let imageLoaded = true;
  let showSkeleton = true;
</script>

<a
  in:fade
  href="https://anilist.co/character/{character.id}"
  target="_blank"
  rel="noopener noreferrer nofollow"
  class="group-one flex w-32 flex-col items-center gap-2 focus-visible:outline-transparent"
  style:--anime-color={color}
>
  <div class="avatar">
    <div
      class="w-28 rounded-full ring ring-transparent transition-shadow duration-200
      {color
        ? 'hover:ring-[--anime-color] group-one-focus-visible:ring-[--anime-color]'
        : 'hover:ring-accent group-one-focus-visible:ring-accent'}"
    >
      <img
        src={imageLoaded ? character.image : '/assets/loading_failure.jpeg'}
        alt={character.name.full}
        on:error|once={() => (imageLoaded = false)}
        on:load|once={() => (showSkeleton = false)}
        class:skeleton={showSkeleton}
      />
    </div>
  </div>
  <div
    class="group flex w-full flex-col gap-1 text-base-content text-opacity-80 hover:text-opacity-100 group-one-focus-visible:text-opacity-100"
  >
    <h3
      class="text-md line-clamp-2 whitespace-normal font-bold leading-tight transition-colors duration-200
      {color
        ? 'group-hover:text-[--anime-color] group-one-focus-visible:text-[--anime-color]'
        : 'group-hover:text-accent group-one-focus-visible:text-accent'}"
    >
      {character.name.full}
    </h3>
    {#if character.name.native}
      <h2
        class="native-name line-clamp-2 whitespace-normal text-xs leading-tight transition-colors duration-200"
      >
        {character.name.native}
      </h2>
    {/if}
  </div>
</a>

<style>
  .native-name {
    font-family: 'FOT-NewRodin Pro M';
  }
</style>
