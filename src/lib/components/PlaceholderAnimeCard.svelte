<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div
  in:fade
  class="group indicator w-[168px] flex-col gap-2 transition-all duration-200 focus-visible:outline-transparent lg:w-[210px]"
>
  <div
    class="group-one card relative m-0 aspect-[0.7/1] h-[240px] w-[168px] overflow-clip rounded-md bg-base-300 p-0 lg:h-[300px] lg:w-[210px]"
  >
    <div class="skeleton card-body relative m-0 h-full w-full bg-repeat p-0" />
  </div>

  <div class="skeleton h-9 2xl:h-11" />
</div>
