<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faArrowLeft,
    faArrowRight,
    faBookmark,
    faCog
  } from '@fortawesome/free-solid-svg-icons';
  import { searchHistory } from '$lib/model/searchHistory';
  import { goto } from '$app/navigation';
  import { _toUpperCase } from '../../routes/search/+page';

  let value = '';
</script>

<div
  class="navbar sticky top-0 left-0 right-0 z-50 rounded-b-md bg-base-100 bg-opacity-80 backdrop-blur-xl backdrop-filter"
>
  <div class="navbar-start flex gap-2">
    <div class="flex gap-1">
      <button
        class="btn-ghost btn-sm btn"
        on:click={() => window.history.back()}
      >
        <Fa icon={faArrowLeft} size="1.2x" />
      </button>
      <button
        class="btn-ghost btn-sm btn"
        on:click={() => window.history.forward()}
      >
        <Fa icon={faArrowRight} size="1.2x" />
      </button>
    </div>
    <!-- TODO: Add other navigation links -->
    <a href="/" class="btn-ghost btn text-xl normal-case">Layendanimator</a>
    <form
      on:submit|preventDefault={() => {
        const query = _toUpperCase(value.trim());
        if (!query) return;
        searchHistory.add(query);
        goto(`/search?q=${query}`);
      }}
      class="flex h-12 w-full items-center justify-center"
    >
      <input
        type="search"
        placeholder="Search an anime"
        class="h-full flex-1 rounded-md bg-base-200 px-2 text-base shadow-md ring-2 ring-base-200 transition-shadow duration-200 focus:outline-none focus:ring-accent focus:ring-opacity-50"
        autocomplete="off"
        autocapitalize="words"
        bind:value
      />
    </form>
  </div>
  <div class="absolute right-2 top-2 bottom-2 flex gap-2">
    <a href="/library" class="btn-ghost btn">
      <Fa icon={faBookmark} size="1.2x" />
    </a>
    <a href="/settings" class="btn-ghost btn">
      <Fa icon={faCog} size="1.2x" />
    </a>
  </div>
</div>
