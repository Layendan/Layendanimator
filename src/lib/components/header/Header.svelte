<script lang="ts">
  import logo from "./logo.png";
  import { goto } from "$app/navigation";
  import { history } from "$lib/model/history";
  import { fade } from "svelte/transition";
  import { page } from "$app/stores";

  let y: number = 0;
  $: query = "";

  $: opacity = y < 40 ? y * 0.0125 + 0.3 : 0.8;
  $: blur = `${y < 40 ? y * 0.5 : 20}px`;
  $: saturation = y < 40 ? y * -0.00625 + 1 : 0.75;

  console.log($page);
</script>

<svelte:window bind:scrollY={y} />

<!-- This is so that the default focus doesn't start at the link -->
<!-- svelte-ignore a11y-missing-content -->
<!-- svelte-ignore a11y-autofocus -->
<a href="/" style="outline: none;" autofocus={true} />

<header
  class:bottom-border={y > 40}
  style:--header-opacity={opacity}
  style:--header-blur={blur}
  style:--header-saturation={saturation}
>
  <nav class="logo" in:fade>
    <a sveltekit:prefetch href="/" class:selected={$page.routeId === ""}>
      <img src={logo} alt="NineAnimator" />
      NineAnimator
    </a>
  </nav>

  <nav>
    <a href="/library/downloads" class:selected={$page.routeId === "library/downloads"}>Downloads</a>
    <a href="/library/history" class:selected={$page.routeId === "library/history"}>History</a>
  </nav>

  <div class="corner">
    <!-- Need to grab autocomplete from history.search -->
    <input
      type="search"
      placeholder="Search"
      class="search"
      autocapitalize="words"
      list="searchRec"
      bind:value={query}
      on:keydown={(event) => {
        if (event.key === "Enter" && query !== "") {
          event.preventDefault();
          if (!$history.search.includes(query))
            $history.search = [...$history.search, query];
          goto(`/search?search=${query}`);
        }
      }}
    />
    <datalist id="searchRec">
      {#each $history.search as option}
        <option value={option}>{option}</option>
      {/each}
    </datalist>
  </div>

  <nav class="settings">
    <a href="/settings" class:selected={$page.routeId === "settings"}
      >Settings</a
    >
  </nav>
</header>

<style>
  header {
    display: flex;
    /* justify-content: space-between; */
    gap: 5rem;
    width: 100%;
    position: sticky;
    top: 0px;
    /* padding-bottom: 5px; */
    z-index: 10;
    overflow: hidden;

    transition: box-shadow 0.2s ease-in-out;

    background-color: rgba(var(--primary-rgb), var(--header-opacity));
    -webkit-backdrop-filter: blur(var(--header-blur))
      saturate(var(--header-saturation));
    backdrop-filter: blur(var(--header-blur)) saturate(var(--header-saturation));
  }

  img {
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

  .corner input:focus {
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

  a {
    color: var(--text-color);
  }

  a:hover {
    color: var(--accent-color);
  }

  .bottom-border {
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  }

  .settings {
    margin-right: 2rem;
  }

  .selected {
    border-bottom: 2px solid var(--accent-color);
  }
</style>
