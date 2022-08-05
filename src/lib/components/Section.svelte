<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  export let storageId: string;
  let sleft: number = Number.parseInt(
    window?.sessionStorage.getItem(storageId)
  );
  let items: HTMLDivElement;

  onMount(() => (items.scrollLeft = sleft));
  onDestroy(() => window?.sessionStorage.setItem(storageId, sleft.toString()));
</script>

<div class="anime-container" in:fade>
  <hr class="solid" />
  <p class="title"><slot name="title" /></p>
  <!-- change windows-scrollbar to check if running on windows -->
  <div
    class="items windows-scrollbar"
    bind:this={items}
    on:scroll={() => (sleft = items.scrollLeft)}
    in:fade
  >
    <slot name="animes" />
  </div>
</div>

<style>
  * {
    scrollbar-width: thin;
    overscroll-behavior: contain;
  }

  p {
    color: var(--text-color);
  }

  .anime-container {
    margin-left: 10px;
    margin-right: 10px;
  }

  .items {
    display: inline-flexbox;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    width: auto;
    white-space: nowrap;
    padding-bottom: 15px;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
  }

  .windows-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--text-color) var(--tertiary-color);
  }

  .windows-scrollbar::-webkit-scrollbar {
    height: 7px;
    border-radius: 100px;
  }
  .windows-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(var(--pure-white-rgb), 0.7);
    background-clip: padding-box;
    border-radius: 100px;
    border: 2px, solid, transparent;
  }

  .windows-scrollbar::-webkit-scrollbar-track {
    background-color: rgba(var(--tertiary-rgb), 0.7);
    border-radius: 100px;
  }

  .windows-scrollbar::-webkit-scrollbar-thumb:active {
    background: rgba(
      var(--pure-white-rgb),
      0.61
    ); /* Some darker color when you click it */
    border-radius: 100px;
  }

  .windows-scrollbar::-webkit-scrollbar-track:hover {
    background-color: rgba(var(--secondary-rgb), 0.7);
  }

  .title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 12px;
    z-index: 3;
    position: relative;
  }

  hr.solid {
    margin-top: 20px;
    border-top: 1px solid;
    border-color: var(--secondary-color);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
  }
</style>
