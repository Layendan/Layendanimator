<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { clearCache } from '$lib/model/cache';
  import {
    faArrowLeft,
    faArrowRight,
    faRotateRight
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
</script>

{#if window?.__TAURI__}
  <div class="flex gap-1">
    <button class="btn btn-ghost btn-sm" on:click={() => window.history.back()}>
      <Fa icon={faArrowLeft} size="1.2x" />
    </button>
    <button
      class="btn btn-ghost btn-sm"
      on:click={() => window.history.forward()}
    >
      <Fa icon={faArrowRight} size="1.2x" />
    </button>
    <button
      class="btn btn-ghost btn-sm"
      on:click={() => {
        clearCache();
        invalidateAll();
      }}
    >
      <Fa icon={faRotateRight} size="1.2x" />
    </button>
  </div>
{/if}
