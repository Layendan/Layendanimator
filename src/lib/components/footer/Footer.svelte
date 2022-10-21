<script lang="ts">
  import { page } from "$app/stores";
</script>

<footer>
  <a href="/" class:selected={$page.routeId === "/"}> Main </a>
  <a
    href="/library/downloads"
    class:selected={$page.routeId === "/library/downloads"}>Downloads</a
  >
  <a
    href="/library/history"
    class:selected={$page.routeId === "/library/history"}>History</a
  >
  <a href="/settings" class:selected={$page.routeId === "/settings"}>Settings</a
  >
</footer>

<style>
  footer {
    display: inline-flex;
    align-items: center;
    justify-content: space-around;
    gap: 5rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    z-index: 10;
    border-top: 1px solid var(--tertiary-color);
    background-color: rgba(var(--primary-rgb), 0.8);
    -webkit-backdrop-filter: blur(20px) saturate(0.75);
    backdrop-filter: blur(20px) saturate(0.75);
  }

  a {
    height: min-content;
    color: var(--text-color);
  }

  a:not(.selected):hover {
    color: var(--accent-color);
  }

  .selected {
    border-bottom: 2px solid var(--accent-color);
    text-decoration: none;
  }
</style>
