<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<header in:fade class="relative h-[60vh] w-full overflow-hidden">
  <div class="skeleton h-[60vh] w-full" />
  <div class="scrim pointer-events-none absolute inset-0 translate-y-1" />
</header>
