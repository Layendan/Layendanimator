<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  export let storageId: string;
  let sleft: number = parseInt(
    window?.sessionStorage.getItem(storageId) ?? "0"
  );
  let items: HTMLDivElement;

  onMount(() => (items.scrollLeft = sleft));
  onDestroy(() => window.sessionStorage.setItem(storageId, sleft.toString()));
</script>

<div class="anime-container" in:fade>
  <hr class="solid" />
  <p class="title"><slot name="title" /></p>
  <div
    class="items"
    bind:this={items}
    on:scroll={() => (sleft = items.scrollLeft)}
    in:fade
  >
    <slot name="animes" />
  </div>
</div>

<style>
  p {
    color: var(--text-color);
  }

  .anime-container {
    overscroll-behavior-x: contain;
    margin-left: 10px;
    margin-right: 10px;
    overflow-y: visible;
  }

  .items {
    display: inline-flexbox;
    overflow-x: scroll;
    overflow-y: visible;
    scroll-behavior: smooth;
    width: auto;
    white-space: nowrap;
    padding-top: 4px;
    padding-bottom: 15px;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
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
