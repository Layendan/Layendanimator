<script lang="ts">
  let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<header
  class="relative -m-4 mb-4 motion-reduce:!translate3d-y-0"
  style="transform: translate3d(0, {scrollY <= 0 ? 0 : scrollY / 1.5}px, 0);"
>
  <img
    class="h-96 w-full object-cover"
    src="/assets/loading_failure.jpeg"
    alt="loading"
  />
  <div class="scrim pointer-events-none absolute inset-0" />
  <div
    class="absolute inset-0 flex items-end bg-gradient-to-tr from-base-100/80"
  >
    <div
      class="flex max-w-lg flex-1 flex-col justify-center gap-y-4 p-4 lg:max-w-xl"
    >
      <h1
        class="line-clamp-3 pb-1 text-3xl font-extrabold tracking-tight drop-shadow-lg md:text-4xl lg:text-5xl"
      >
        Loading...
      </h1>

      <p class="text-md line-clamp-2 drop-shadow-lg md:text-lg lg:text-xl">
        Loading description...
      </p>

      <div class="flex gap-x-2">
        <div class="btn-primary btn flex gap-x-2 px-8">Play placeholder</div>
        <div class="btn-outline btn">Details placeholder</div>
      </div>
    </div>
  </div>
</header>
