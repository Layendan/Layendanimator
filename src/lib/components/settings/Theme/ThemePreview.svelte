<script lang="ts">
  export let title: string;
  export let image: string;
  export let selected: boolean = false;
  export let disabled: boolean = false;
</script>

<div on:click class:selected class:disabled>
  <img src={image} alt="" />
  <h4>{title}</h4>
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
    background-color: var(--tertiary-color);
    border: 2px var(--tertiary-color) solid;
    border-radius: 5px;
  }

  div.selected {
    border-color: var(--accent-color);
  }

  div.disabled {
    filter: brightness(70%);
    cursor: default;
    pointer-events: none;
  }

  img {
    width: 200px;
    height: 100%;
    aspect-ratio: 3/2;
    object-fit: cover;
  }

  h4 {
    padding: 0;
    margin: 0;
  }
</style>
