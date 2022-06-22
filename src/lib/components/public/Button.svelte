<script lang="ts">
  export let buttonType: "active" | "danger" | "default" = "default";
</script>

<button on:click class={`${buttonType} ${$$props.class ?? ""}`}>
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
    width: fit-content;
    transition: 0.2s;
  }

  .active {
    background-color: var(--active-color);
    color: var(--text-color);
  }

  .active:hover {
    background-color: var(--active-hover-color);
    color: var(--text-color);
  }

  .danger {
    background-color: var(--tertiary-color);
    color: var(--danger-color);
  }

  .danger:hover {
    background-color: var(--danger-color);
    color: var(--text-color);
  }

  .default {
    background-color: var(--tertiary-color);
    color: var(--accent-color);
  }

  .default:hover {
    background-color: var(--accent-color);
    color: var(--text-color);
  }
</style>
