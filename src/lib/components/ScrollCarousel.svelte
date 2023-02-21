<script lang="ts">
  export let key: unknown = undefined;
</script>

<section
  class="card bg-clip-padding bg-base-200 backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-full"
>
  <slot name="header" />
  <h1
    class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
  >
    <slot name="title" />
  </h1>
  {#key key}
    <div
      class="relative inline-flex overflow-x-scroll overscroll-x-contain whitespace-nowrap w-auto gap-6 p-4 pb-6"
    >
      <slot name="content" />
    </div>
  {/key}
</section>

<style lang="postcss">
  /* your styles go here */
  /* width */
  ::-webkit-scrollbar {
    @apply w-full;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    @apply rounded-md filter;
    box-shadow: inset 0 0 3px hsl(var(--bc));
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    @apply bg-base-content rounded-md;
  }
</style>
