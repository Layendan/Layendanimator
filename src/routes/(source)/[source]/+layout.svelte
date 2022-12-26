<script lang="ts">
  import { goto } from "$app/navigation";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import { capitalize } from "$lib/model/global";
  import { activeSources } from "$lib/model/sources";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
  let value: string;
</script>

<header>
  <div class="source-select">
    <a href="/{data.source.id}">
      <img alt={data.source.name} src={data.source.icon} />
    </a>
    <!-- Dropdown -->
    <form
      class="sources"
      on:submit|preventDefault={() => {
        if (value !== data.source.id) {
          goto(value);
        }
      }}
    >
      <select name="sources" bind:value>
        {#each $activeSources as source}
          <option value={source.id} selected={source.id === data.source.id}>
            {capitalize(source.name)}
          </option>
        {/each}
      </select>
    </form>
  </div>
  <SearchBar source={data.source} />
</header>
<slot />

<style>
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 20;
    background: linear-gradient(
      to bottom,
      rgba(var(--primary-rgb), 1) 20%,
      rgba(var(--primary-rgb), 0) 100%
    );
    padding-top: 1rem;
  }

  .source-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-left: 1.5rem;
  }

  .sources {
    margin-left: 1rem;
  }

  .sources select {
    appearance: none;
    -webkit-appearance: none;
    background-color: rgba(var(--primary-rgb), 0.3);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-radius: 5px;
    border: 1px solid var(--secondary-color);
    color: var(--text-color);
    accent-color: var(--accent-color);
    outline: none;
    padding: 0.5rem 1rem;

    transition: border-color 0.2s ease-in-out;
  }

  img {
    width: 2rem;
    height: 2rem;
  }
</style>
