<script lang="ts">
  import { searchHistory } from '$lib/model/searchHistory';
  import { goto } from '$app/navigation';
  import { _toUpperCase } from '../../routes/search/+page';

  let value = '';
</script>

<form
  on:submit|preventDefault={() => {
    const query = _toUpperCase(value.trim());
    if (!query) return;
    searchHistory.add(query);
    goto(`/search?q=${encodeURIComponent(query)}`);
  }}
  class="flex h-12 w-full items-center justify-center"
>
  <input
    type="search"
    placeholder="Search an anime"
    class="h-full flex-1 rounded-md bg-base-200 px-2 text-base capitalize shadow-md ring-2 ring-base-200 transition-shadow duration-200 focus:outline-none focus:ring-accent"
    autocomplete="off"
    autocapitalize="words"
    bind:value
  />
</form>
