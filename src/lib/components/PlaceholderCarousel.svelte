<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<header in:fade class="relative -m-4 mb-4 h-[60vh] w-screen">
  <div class="skeleton h-[60vh] w-full" />
  <div class="scrim pointer-events-none absolute inset-0" />
</header>
