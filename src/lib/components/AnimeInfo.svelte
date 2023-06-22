<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';

  export let anime: Anime;

  let descriptionCollapsed = true;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="card block h-min w-auto bg-base-200 bg-opacity-80 p-4 shadow-xl backdrop-blur-xl backdrop-filter transition-colors duration-200"
  class:hover:bg-base-300={descriptionCollapsed}
  class:cursor-pointer={descriptionCollapsed}
  on:click={() => (descriptionCollapsed = false)}
>
  <h1
    class="mb-4 text-3xl font-extrabold leading-none tracking-tight transition-[font-size] duration-200 md:text-4xl lg:text-5xl"
  >
    {anime.title.english ?? anime.title.romaji}
  </h1>
  <ul class="mb-4 flex flex-wrap gap-1">
    {#if anime.type}
      <div class="badge badge-accent badge-outline">
        {anime.type.replaceAll('_', ' ')}
      </div>
    {/if}
    {#if anime.isAdult}
      <div class="badge badge-error badge-outline">18+</div>
    {/if}
    {#if anime.status}
      <div class="badge badge-accent badge-outline">
        {anime.status}
      </div>
    {/if}
    {#each anime.genres as genre}
      <div class="badge badge-accent badge-outline">{genre}</div>
    {/each}
    {#if anime.rating}
      <div
        class="badge badge-outline"
        class:badge-error={anime.rating <= 60}
        class:badge-warning={anime.rating > 60 && anime.rating <= 75}
        class:badge-success={anime.rating > 75}
      >
        {anime.rating}%
      </div>
    {/if}
  </ul>
  <p
    class="h-min w-fit"
    class:line-clamp-[3]={descriptionCollapsed}
    class:lg:line-clamp-[6]={descriptionCollapsed}
  >
    {@html anime.description || '<i>No description available.</i>'}
  </p>
  <br />
  <button
    class="cursor-pointer font-semibold"
    on:click={e => {
      descriptionCollapsed = !descriptionCollapsed;
      e.stopPropagation();
    }}
  >
    Show {descriptionCollapsed ? 'more' : 'less'}
  </button>
</div>
