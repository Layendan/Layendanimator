<script lang="ts">
  export let checked: boolean = false;
  export let disabled: boolean = false;
</script>

<span class="container">
  <label class="switch">
    <input type="checkbox" bind:checked on:change {disabled} />
    <span class="slider" />
  </label>
  <slot />
</span>

<style>
  .container {
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }

  input:disabled ~ * {
    filter: brightness(70%);
    cursor: default;
  }

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 45px;
    height: 25px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 25px;
    background-color: var(--tertiary-color);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    border-radius: 50%;
    background-color: var(--pure-white);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: var(--accent-color);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--accent-color);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(19px);
    -ms-transform: translateX(19px);
    transform: translateX(19px);
  }
</style>
