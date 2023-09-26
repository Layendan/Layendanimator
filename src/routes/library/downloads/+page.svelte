<script lang="ts">
  import DownloadsData from '$lib/components/DownloadsData.svelte';
  import GridContent from '$lib/components/GridContent.svelte';
</script>

<GridContent>
  <svelte:fragment slot="title">Downloaded Animes</svelte:fragment>

  <DownloadsData />
</GridContent>
