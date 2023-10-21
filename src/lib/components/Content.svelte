<script>
  import { fade } from 'svelte/transition';
</script>

<section
  in:fade
  class="card max-w-full rounded-lg bg-base-200 bg-opacity-80 bg-clip-padding p-8 shadow-xl backdrop-blur-xl backdrop-filter"
>
  <slot />
</section>
