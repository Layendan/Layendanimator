<script lang="ts">
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
    <a sveltekit:prefetch href="/" class="noselect">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav />

  <div class="corner">
    <input
      type="search"
      placeholder="Search"
      class="search"
      style="transform: translateX(-13em); margin-top: 0.5em;"
      autocapitalize="words"
      bind:value={query}
      on:keydown={(event) => {
        if (event.key === "Enter" && query !== "") {
          event.preventDefault();
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

    transition: box-shadow 0.2s ease-in-out;
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
    outline: none;
  }

  .corner a:focus > img {
    outline: 2px solid #895ef4;
  }

  .corner input:focus {
    outline: 2px solid #895ef4;
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
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  }

  .noselect {
    /* From https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting */
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>
