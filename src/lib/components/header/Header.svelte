<script lang="ts">
  import logo from "./logo.png";
  import { goto } from "$app/navigation";
  import { history } from "$lib/model/history";
  import Anime from "../Anime.svelte";

  let y = 0;
  $: query = "";

  $: opacity = y < 40 ? y * 0.0125 + 0.3 : 0.8;
  $: blur = `${y < 40 ? y * 0.5 : 20}px`;
  $: saturation = y < 40 ? y * -0.00625 + 1 : 0.75;
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
  <div class="corner">
    <a sveltekit:prefetch href="/">
      <img src={logo} alt="NineAnimator" />
    </a>
  </div>

  <nav>
    <a href="/settings">Settings</a>
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
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
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

  .search {
    background-color: transparent;
    color: var(--text-color);
    accent-color: var(--accent-color);
    -webkit-appearance: textfield;
    transform: translateX(-13em);
    margin-top: 0.3rem;
  }

  .corner {
    width: 3em;
    height: 3em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .corner a:focus > img {
    outline: 2px solid var(--accent-color);
  }

  .corner input:focus {
    outline: 2px solid var(--accent-color);
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
</style>
