<script lang="ts">
  import { fade } from "svelte/transition";
  import { activeSources } from "$lib/model/sources";
  import { page } from "$app/stores";

  let y: number = 0;

  $: opacity = y < 40 ? y * 0.0125 + 0.3 : 0.8;
  $: blur = `${y < 40 ? y * 0.5 : 20}px`;
  $: saturation = y < 40 ? y * -0.00625 + 1 : 0.75;
</script>

<svelte:window bind:scrollY={y} />

{#if $activeSources}
  <header
    transition:fade
    class:bottom-border={y > 40}
    style:--header-opacity={opacity}
    style:--header-blur={blur}
    style:--header-saturation={saturation}
  >
    <!-- <nav class="logo" in:fade>
    <a href="/" class:selected={$page.route.id === ""}>
      <img src={logo} alt="NineAnimator" />
      NineAnimator
    </a>
  </nav>

  <nav>
    <a
      href="/library/downloads"
      class:selected={$page.route.id === "library/downloads"}>Downloads</a
    >
    <a
      href="/library/history"
      class:selected={$page.route.id === "library/history"}>History</a
    >
  </nav>

  <div class="corner">
    <form
      on:submit|preventDefault={() => {
        if (!$history.search.includes(query))
          $history.search = [...$history.search, query];
        goto(`/search?search=${query}`);
      }}
    >
      <input
        type="search"
        placeholder="Search"
        class="search"
        autocapitalize="words"
        list="searchRec"
        bind:value={query}
      />
      <datalist id="searchRec">
        {#each $history.search as option}
          <option value={option}>{option}</option>
        {/each}
      </datalist>
    </form>
  </div>

  <nav class="settings">
    <a href="/settings" class:selected={$page.route.id === "settings"}
      >Settings</a
    >
  </nav> -->

    {#each $activeSources as source}
      <a href="/{source.id}" class:selected={$page.route.id === source.id}>
        {source.name}
      </a>
    {/each}
  </header>
{/if}

<style>
  header {
    display: flex;
    gap: 5rem;
    width: 100%;
    position: sticky;
    top: 0px;
    z-index: 10;
    overflow: hidden;
    background-color: rgba(var(--primary-rgb), var(--header-opacity));
    -webkit-backdrop-filter: blur(var(--header-blur))
      saturate(var(--header-saturation));
    backdrop-filter: blur(var(--header-blur)) saturate(var(--header-saturation));

    transition: box-shadow 0.2s ease-in-out;
  }

  /* img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  .search {
    background-color: transparent;
    width: 100%;
    color: var(--text-color);
    accent-color: var(--accent-color);
    -webkit-appearance: textfield;
    margin-right: 1rem;
    margin-top: 0.3rem;
  }

  .corner {
    width: 100%;
    height: 3em;
    margin-left: auto;
    margin-right: auto;
  }

  .corner input:focus-visible {
    outline: 2px solid var(--accent-color);
  }

  .logo {
    height: 3em;
    margin-left: 1rem;
  }

  .logo a {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    outline: none;
    margin-right: auto;
  }

  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    margin-left: auto;
    margin-right: auto;
  }

  nav a {
    border-bottom: 2px none var(--accent-color);
  }
  */

  a {
    color: var(--text-color);
  }

  a:not(.selected):hover {
    color: var(--accent-color);
  }

  .bottom-border {
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  }

  /* .settings {
    margin-right: 2rem;
  } */

  .selected {
    border-bottom: 2px solid var(--accent-color);
    text-decoration: none;
  }
</style>
