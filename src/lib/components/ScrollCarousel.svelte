<script>
  import Content from './Content.svelte';
</script>

<Content>
  <slot name="header">
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      <slot name="title" />
    </h1>
  </slot>
  <div
    class="relative inline-flex w-auto gap-6 overflow-x-scroll overscroll-x-contain scroll-smooth whitespace-nowrap p-4 pb-6 motion-reduce:scroll-auto"
  >
    <slot />
  </div>
</Content>

<style>
  div::-webkit-scrollbar {
    @apply h-4 w-4;
  }

  div::-webkit-scrollbar-corner {
    @apply bg-transparent;
  }

  /* Track */
  div::-webkit-scrollbar-track {
    @apply rounded-lg border-4 border-solid border-transparent bg-base-300 bg-clip-padding;
  }

  /* Handle */
  div::-webkit-scrollbar-thumb {
    @apply min-h-[40px] min-w-[40px] rounded-lg border-4 border-solid border-transparent bg-base-content bg-clip-padding;
  }
</style>
