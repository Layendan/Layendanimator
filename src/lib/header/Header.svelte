<script lang="ts">
  import { page } from "$app/stores";
  import logo from "./logo.png";
  import { goto } from "$app/navigation";

  let y = 0;
  $: query = "";
</script>

<svelte:window bind:scrollY={y} />

<header
  class:bottom-border={y > 40}
  style="background-color: rgba(51, 51, 51, {y < 40
    ? y * 0.01675 + 0.3
    : 0.97});"
>
  <div class="corner">
    <a sveltekit:prefetch href="/">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav />

  <div class="corner">
    <!-- Tab navigation on safari is locked behind preference, fixed in 
    https://github.com/tauri-apps/wry/commit/28ebedc41f9017fed3fe1dc3a6d021c69f88ef5d
    Have to wait until fix goes to tauri
    3 days off of making it to the release :( -->
    <input
      type="search"
      placeholder="Search"
      class="search"
      style="transform: translateX(-13em); margin-top: 0.5em;"
      bind:value={query}
      on:keydown={(event) => {
        if (event.key === "Enter" && query !== "") {
          goto(`/search?search=${query}`);
        }
      }}
    />
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

    transition: border 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  }

  .search {
    background-color: rgba(55, 55, 55, 0.5);
    color: white;
    accent-color: white;
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
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  a:hover {
    color: var(--accent-color);
  }

  .bottom-border {
    border-bottom: 2px solid rgb(60, 60, 60);
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  }
</style>
