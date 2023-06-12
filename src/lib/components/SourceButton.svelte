<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { clearCache } from '$lib/model/cache';
  import { providers, source } from '$lib/model/source';
</script>

{#if window?.__TAURI__}
  <div class="dropdown block">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <label tabindex="0" class="btn-accent btn-outline btn w-fit">Sources</label>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
      tabindex="0"
      class="dropdown-content rounded-box z-10 mt-2 w-52 rounded-t-none bg-base-100 bg-opacity-80 bg-clip-padding p-2 shadow-xl backdrop-blur-xl backdrop-filter"
    >
      {#each Object.values($providers) as provider}
        <li class="m-1">
          <button
            class="btn-outline btn flex w-full flex-row items-center gap-1 text-base-content
          {$source.id === provider.id ? 'btn-disabled' : 'btn-accent '}"
            disabled={$source.id === provider.id}
            on:click={() => {
              source.set(provider);
              clearCache();
              invalidateAll();
            }}
          >
            <img
              src={provider.logo}
              alt={provider.name}
              class="h-5 w-5 rounded-md"
            />
            {provider.name}
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}
