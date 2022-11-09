<script lang="ts">
  export let type: "active" | "danger" | "default" = "default";
  export let size:
    | "small"
    | "medium"
    | "large"
    | "minContent"
    | "maxContent"
    | "fitContent"
    | "all" = "fitContent";
  export let disabled: boolean = false;
</script>

<button on:click on:mouseenter on:mouseleave class="{type} {size}" {disabled}>
  <slot />
</button>

<style>
  button {
    border: 0px;
    border-radius: 5px;
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    font-size: 14px;
    font-weight: 500;
    transition: 0.2s;
  }

  button:disabled {
    opacity: 0.7;
    cursor: default;
  }

  button:not(:disabled):active {
    opacity: 0.9;
  }

  .small {
    width: 100px;
  }

  .medium {
    width: 200px;
  }

  .large {
    width: 300px;
  }

  .minContent {
    width: min-content;
  }

  .maxContent {
    width: max-content;
  }

  .fitContent {
    width: fit-content;
  }

  .all {
    width: 100%;
  }

  .active {
    background-color: var(--active-color);
    color: var(--text-color);
  }

  .active:not(:disabled):hover {
    background-color: var(--active-hover-color);
    color: var(--text-hover-color);
  }

  .danger {
    background-color: var(--tertiary-color);
    color: var(--danger-color);
  }

  .danger:not(:disabled):hover {
    background-color: var(--danger-color);
    color: var(--text-hover-color);
  }

  .active:disabled {
    color: var(--tertiary-color);
  }

  .default {
    background-color: var(--tertiary-color);
    color: var(--text-color);
  }

  .default:not(:disabled):hover {
    background-color: var(--accent-color);
    color: var(--text-hover-color);
  }

  .active:disabled {
    color: var(--tertiary-color);
  }
</style>
