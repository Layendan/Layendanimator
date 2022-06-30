<script lang="ts">
  export let image: string;
  export let selected: boolean = false;
  export let disabled: boolean = false;
  export let hover: boolean = true;
</script>

<div on:click class:selected class:disabled class:hover>
  <img src={image} alt="" />
  <p class="header"><slot /></p>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    max-width: 220px;
    max-height: 200px;
    padding: 1rem;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: var(--tertiary-color);
    border: 2px var(--tertiary-color) solid;
    border-radius: 5px;

    transition: 0.2s;
  }

  div.selected {
    border-color: var(--accent-color);
  }

  div.disabled {
    filter: brightness(70%);
    cursor: default;
    pointer-events: none;
  }

  div.hover:not(.selected):hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
  }

  div.hover:not(.selected):hover .header {
    color: var(--text-color);
  }

  img {
    width: 200px;
    height: 100%;
    aspect-ratio: 3/2;
    object-fit: cover;
    border-radius: 5px;
  }

  .header {
    padding: 0;
    margin: 0;
    color: var(--accent-color);
    border-color: var(--accent-color);
  }
</style>
