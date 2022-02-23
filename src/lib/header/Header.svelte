<script lang="ts">
  import { page } from "$app/stores";
  import logo from "./logo.png";

  export let isHidden = false;

  let y = 0;
</script>

<svelte:window bind:scrollY={y} />

<header
  class:bottom-border={y > 40}
  class:isHidden
  style="background-color: rgba(51, 51, 51, {y < 40
    ? y * 0.01675 + 0.3
    : 0.97});"
>
  <div class="corner">
    <a sveltekit:prefetch href="/">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li class:active={$page.url.pathname === "/"}>
        <a sveltekit:prefetch href="/">Home</a>
      </li>
      <li class:active={$page.url.pathname === "/about"}>
        <a sveltekit:prefetch href="/about">About</a>
      </li>
      <li class:active={$page.url.pathname === "/todos"}>
        <a sveltekit:prefetch href="/todos">Todos</a>
      </li>
      <li class:active={$page.url.pathname === "/help"}>
        <a sveltekit:prefetch href="/help">Help</a>
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <div class="corner" />
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0px;
    /* padding-bottom: 5px; */
    z-index: 10;

    transition: border 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
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

  .isHidden {
    display: none;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li.active::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--accent-color);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    color: var(--heading-color);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 10%;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--accent-color);
  }

  .bottom-border {
    border-bottom: 2px solid rgb(60, 60, 60);
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.5);
  }
</style>
