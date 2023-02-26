<script lang="ts">
  export let key: unknown = undefined;
</script>

<section
  class="card max-w-full bg-base-200 bg-opacity-80 bg-clip-padding p-8 shadow-xl backdrop-blur-xl backdrop-filter"
>
  <slot name="header" />
  <h1
    class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
  >
    <slot name="title" />
  </h1>
  {#key key}
    <div
      class="relative inline-flex w-auto gap-6 overflow-x-scroll overscroll-x-contain whitespace-nowrap p-4 pb-6"
    >
      <slot name="content" />
    </div>
  {/key}
</section>

<style lang="postcss">
  /* your styles go here */
  /* width */
  ::-webkit-scrollbar {
    @apply h-4 w-4;
  }

  ::-webkit-scrollbar-corner {
    @apply bg-transparent;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    @apply rounded-lg border-4 border-solid border-transparent bg-base-300 bg-clip-padding;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    @apply min-h-[40px] min-w-[40px] rounded-lg border-4 border-solid border-transparent bg-base-content bg-clip-padding;
  }
</style>
