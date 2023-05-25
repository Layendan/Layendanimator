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
    class="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] justify-items-center gap-8 p-4 pb-0"
  >
    <slot name="content" />
  </div>
</Content>
