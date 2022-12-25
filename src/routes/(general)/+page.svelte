<script script lang="ts">
  import { fade } from "svelte/transition";
  import Group from "$lib/components/settings/Group.svelte";
  import SourceInput from "$lib/components/settings/sources/SourceInput.svelte";
</script>

<svelte:head>
  <title>Layendanimator</title>
</svelte:head>

<div class="container" in:fade>
  <!-- TODO: Change link to something real -->
  <Group
    title="Add A Source"
    description="Enter the link to a source - Try: &#34;https://google.com&#34;"
  >
    <SourceInput />
  </Group>
</div>

<style>
  .container {
    display: grid;
    place-items: center;
    height: 89vh;
    margin: 0 2rem;
    width: calc(100vw - 4rem);
  }
</style>
