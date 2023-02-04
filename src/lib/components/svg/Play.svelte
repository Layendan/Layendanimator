<script lang="ts">
  export let height: number;
  export let width: number;
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {height}
  {width}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="mr-2"
>
  <circle cx="12" cy="12" r="10" />
  <polygon points="10 8 16 12 10 16 10 8" />
</svg>
