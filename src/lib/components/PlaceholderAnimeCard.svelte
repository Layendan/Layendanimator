<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  in:fade
  class="group indicator w-[210px] flex-col gap-2 focus-visible:outline-transparent"
>
  <div
    class="group-one card relative m-0 aspect-[0.7/1] h-[300px] w-[210px] bg-base-300 bg-clip-content p-0"
  >
    <div
      class="skeleton card-body relative m-0 h-full w-full rounded-md bg-repeat p-0"
    />
  </div>

  <div class="skeleton h-9 rounded-md 2xl:h-11" />
</div>
