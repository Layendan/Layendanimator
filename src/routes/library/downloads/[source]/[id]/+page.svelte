<script lang="ts">
  import AnimePage from '$lib/components/AnimePage.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<AnimePage {data} />
