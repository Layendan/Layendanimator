<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faArrowLeft,
    faArrowRight,
    faRotateRight,
    faBookmark,
    faCog
  } from '@fortawesome/free-solid-svg-icons';
  import { searchHistory } from '$lib/model/searchHistory';
  import { goto, invalidateAll } from '$app/navigation';
  import { _toUpperCase } from '../../routes/search/+page';
  import SourceButton from './SourceButton.svelte';

  let value = '';
</script>

<div
  class="navbar sticky left-0 right-0 top-0 z-50 bg-base-100 bg-opacity-80 backdrop-blur-xl backdrop-filter"
>
  <div class="navbar-start flex gap-2">
    {#if window?.__TAURI__}
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
        <button
          class="btn-ghost btn-sm btn"
          on:click={() => {
            invalidateAll();
            // window.location.reload();
          }}
        >
          <Fa icon={faRotateRight} size="1.2x" />
        </button>
      </div>
    {/if}
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
        class="h-full flex-1 rounded-md bg-base-200 px-2 text-base shadow-md ring-2 ring-base-200 transition-shadow duration-200 focus:outline-none focus:ring-accent"
        autocomplete="off"
        autocapitalize="words"
        bind:value
      />
    </form>
  </div>
  <div class="absolute bottom-2 right-2 top-2 flex gap-2">
    <SourceButton />
    <a href="/library" class="btn-ghost btn">
      <Fa icon={faBookmark} size="1.2x" />
    </a>
    <a href="/settings" class="btn-ghost btn">
      <Fa icon={faCog} size="1.2x" />
    </a>
  </div>
</div>
