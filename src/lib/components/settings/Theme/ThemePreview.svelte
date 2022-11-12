<script lang="ts">
  import { fade } from "svelte/transition";

  export let theme: string;
  export let selected: boolean = false;
  export let disabled: boolean = false;
  export let hover: boolean = true;
</script>

<button on:click class:selected class:disabled class:hover in:fade>
  <div class="preview {theme}">
    <p style="color: var(--secondary-color)">&#x25cf;</p>
    <p style="color: var(--tertiary-color)">&#x25cf;</p>
    <p style="color: var(--text-color)">&#x25cf;</p>
    <p style="color: var(--accent-color)">&#x25cf;</p>
    <p style="color: var(--danger-color)">&#x25cf;</p>
    <p style="color: var(--active-color)">&#x25cf;</p>
  </div>
  <p class="header"><slot /></p>
</button>

<style>
  button {
    display: flex;
    flex-direction: column;
    max-width: 220px;
    max-height: 200px;
    padding: 1rem;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(var(--tertiary-rgb), 0.5);
    border: 2px solid transparent;
    border-radius: 5px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);

    transition: 0.2s;
  }

  button.selected {
    border-color: var(--accent-color);
  }

  button.disabled {
    opacity: 0.7;
    cursor: default;
    pointer-events: none;
  }

  button.hover:not(.selected):hover {
    background: var(--accent-color);
    border-color: var(--accent-color);
  }

  button.hover:not(.selected):hover .header {
    color: var(--text-color);
  }

  .preview {
    width: 180px;
    height: 110px;
    display: inline-flex;
    gap: 0.2rem;
    border-radius: 5px;
    background: var(--primary-color);
    padding: 10px;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .header {
    padding: 0;
    margin: 0;
    color: var(--text-color);
    border-color: var(--accent-color);
  }
</style>
