<script lang="ts">
  export let height: number;
  export let width: number;
  export let active = false;
</script>

<div
  class="rounded-md p-2 px-12 bg-base-content"
  class:bg-opacity-100={active}
  class:bg-opacity-0={!active}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {height}
    {width}
    viewBox="0 0 24 24"
    fill="none"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class:stroke-base-100={active}
    class:stroke-current={!active}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
</div>
