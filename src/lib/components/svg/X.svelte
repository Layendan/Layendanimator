<script lang="ts">
  export let width: number;
  export let height: number;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="inline-flex self-center cursor-pointer hover:text-error"
  on:click
>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>
