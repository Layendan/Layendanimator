<script lang="ts">
  import { history } from "$lib/model/history";
  import { goto } from "$app/navigation";
  import type { ActiveSource } from "$lib/model/sources";

  export let source: ActiveSource;
  export let query: string = "";
  let searchBar: HTMLInputElement;
</script>

<svelte:window
  on:keydown={(e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchBar?.focus();
    }
  }}
/>

<form
  on:submit|preventDefault={() => {
    goto(`/${source.id}/search?search=${query}`);
    $history.search = [
      query,
      ...$history.search.filter((item) => item !== query),
    ];
  }}
>
  <input
    type="search"
    placeholder="Search an anime"
    class="search"
    autocomplete="off"
    autocapitalize="words"
    list="searchRec"
    bind:value={query}
    bind:this={searchBar}
  />
  <datalist id="searchRec">
    {#each $history.search as option}
      <option value={option}>{option}</option>
    {/each}
  </datalist>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }

  .search {
    background-color: var(--secondary-color);
    border-radius: 5px;
    border: 1px solid var(--secondary-color);
    width: 90%;
    color: var(--text-color);
    accent-color: var(--accent-color);
    -webkit-appearance: textfield;
    outline: none;

    transition: border-color 0.2s ease-in-out;
  }

  .search:hover,
  .search:focus-visible {
    border-color: var(--tertiary-color);
  }
</style>
