<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<header in:fade class="relative -m-4 mb-4">
  <div class="skeleton h-96 w-full" />
  <div class="scrim pointer-events-none absolute inset-0" />
</header>
