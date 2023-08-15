<script lang="ts">
  import type { PageData } from './$types';
  import AnimePage from '$lib/components/AnimePage.svelte';

  export let data: PageData;
</script>

<AnimePage {data} showDownload />
