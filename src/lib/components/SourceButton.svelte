<script lang="ts">
  import { clearCache } from '$lib/model/cache';
  import { providers, source } from '$lib/model/source';
</script>

<div class="dropdown block">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <label tabindex="0" class="btn-outline btn-accent btn w-fit">
    Change Source
  </label>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <ul
    tabindex="0"
    class="dropdown-content rounded-box z-10 mt-2 w-52 rounded-t-none bg-base-100 bg-opacity-80 bg-clip-padding p-2 shadow-xl backdrop-blur-xl backdrop-filter"
  >
    {#each $providers as provider}
      <li class="m-1">
        <button
          class="btn-outline btn-accent btn flex w-full flex-row items-center gap-1 text-base-content"
          disabled={$source.id === provider.id}
          on:click={() => {
            clearCache();
            source.set(provider);
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
