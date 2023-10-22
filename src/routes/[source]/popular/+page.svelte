<script lang="ts">
  import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="m-4">
  <InfiniteScroll animes={data.data} dataUpdate={data.update}>
    Popular Animes
  </InfiniteScroll>
</div>
