<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faArrowLeft,
    faArrowRight,
    faRotateRight
  } from '@fortawesome/free-solid-svg-icons';
  import { invalidateAll } from '$app/navigation';
  import { clearCache } from '$lib/model/cache';
</script>

{#if window?.__TAURI__}
  <div class="flex gap-1">
    <button class="btn-ghost btn-sm btn" on:click={() => window.history.back()}>
      <Fa icon={faArrowLeft} size="1.2x" />
    </button>
    <button
      class="btn-ghost btn-sm btn"
      on:click={() => window.history.forward()}
    >
      <Fa icon={faArrowRight} size="1.2x" />
    </button>
    <button
      class="btn-ghost btn-sm btn"
      on:click={() => {
        clearCache();
        invalidateAll();
      }}
    >
      <Fa icon={faRotateRight} size="1.2x" />
    </button>
  </div>
{/if}
