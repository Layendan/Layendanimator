<script lang="ts">
  import { goto } from '$app/navigation';
  import { getOS } from '$lib/model/info';
  import { searchHistory } from '$lib/model/searchHistory';
  import { toUpperCase } from '$lib/model/util';
  import { faSearch } from '@fortawesome/free-solid-svg-icons';
  import { onMount } from 'svelte';
  import Fa from 'svelte-fa';

  export let value = '';

  let input: HTMLInputElement;

  let isMac = navigator?.platform?.includes('Mac') ?? false;

  onMount(async () => {
    try {
      isMac = (await getOS()) === 'Darwin';
    } catch {
      // Deprecated, would rather not use
      isMac = navigator.platform.includes('Mac');
    }
  });
</script>

<svelte:window
  on:keydown={e => {
    if ((isMac ? e.metaKey : e.ctrlKey) && e.key === 'k') {
      input?.focus();
      input?.select();
    }
  }}
/>

<form
  on:submit|preventDefault={() => {
    const query = toUpperCase(value.trim());
    if (!query) return;
    searchHistory.add(query);
    goto(`/library/search?q=${encodeURIComponent(query)}`);
  }}
  class="relative z-10 flex h-12 w-full items-center"
>
  <input
    type="search"
    placeholder="Search"
    class="input input-ghost pointer-events-auto w-full bg-base-content/10 pl-10 capitalize transition-colors duration-200 placeholder:text-base-content/50 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none
    {isMac ? 'pr-16' : 'pr-20'}"
    autocomplete="off"
    autocapitalize="words"
    list="search-history"
    on:keydown={e => {
      if (e.key === 'Escape') input?.blur();
    }}
    bind:value
    bind:this={input}
  />

  <Fa
    icon={faSearch}
    class="pointer-events-none absolute left-4 text-base-content"
  />

  <div
    class="shortcut pointer-events-none absolute right-4 text-base-content transition-opacity duration-200"
  >
    <kbd class="kbd kbd-sm bg-base-100/30">
      {isMac ? '⌘' : 'Ctrl'}
    </kbd>
    <kbd class="kbd kbd-sm bg-base-100/30">K</kbd>
  </div>

  <datalist id="search-history">
    {#each $searchHistory as value}
      <option {value} />
    {/each}
  </datalist>
</form>

<style>
  form:focus-within input {
    @apply pr-0;
  }

  form:focus-within .shortcut {
    @apply opacity-0;
  }
</style>
