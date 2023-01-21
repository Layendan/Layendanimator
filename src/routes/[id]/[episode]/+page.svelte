<script lang="ts">
  import Player from '$lib/components/Player.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Player sources={data.episode.sources} />
