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
  export let removeFromTabOrder: boolean = false;
</script>

<button
  on:click
  on:mouseenter
  on:mouseleave
  class="{type} {size}"
  {disabled}
  tabindex={removeFromTabOrder ? -1 : 0}
>
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
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }

  button:disabled {
    opacity: 0.5;
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
    background: rgba(var(--active-rgb), 0.5);
    color: var(--text-color);
  }

  .active:not(:disabled):hover {
    background: var(--active-hover-color);
    color: var(--text-hover-color);
  }

  .danger {
    background: rgba(var(--tertiary-rgb), 0.5);
    color: var(--danger-color);
  }

  .danger:not(:disabled):hover {
    background: var(--danger-color);
    color: var(--text-hover-color);
  }

  .active:disabled {
    color: var(--tertiary-color);
  }

  .default {
    background: rgba(var(--tertiary-rgb), 0.5);
    color: var(--text-color);
  }

  .default:not(:disabled):hover {
    background: var(--accent-color);
    color: var(--text-hover-color);
  }

  .active:disabled {
    color: var(--tertiary-color);
  }
</style>
