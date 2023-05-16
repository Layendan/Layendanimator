<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  in:fade
  class="group indicator w-[210px] flex-col gap-2 focus-visible:outline-transparent"
>
  <div
    class="group-one card relative m-0 aspect-[0.7/1] h-[300px] w-[210px] bg-base-300 bg-clip-content p-0 transition-transform duration-200 hover:-translate3d-y-1 group-focus-visible:-translate-y-1"
  >
    <img
      class="card-body relative m-0 h-full w-full rounded-md bg-accent bg-[url('/assets/loading_failure.jpeg')] bg-cover bg-center bg-no-repeat object-cover object-center p-0"
      src="/assets/loading_failure.jpeg"
      alt="loading"
    />
  </div>

  <div>
    <h3
      class="line-clamp-2 whitespace-normal text-sm font-bold leading-tight text-base-content text-opacity-80 transition-colors duration-200 hover:text-opacity-100 group-focus-visible:text-opacity-100 2xl:text-base"
    >
      Placeholder Text
    </h3>
  </div>
</div>
