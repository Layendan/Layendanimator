<script lang="ts">
  import { source, type Provider } from '$lib/model/source';
  import SourceContextMenu from './SourceContextMenu.svelte';

  export let provider: Provider;

  let element: HTMLButtonElement;
</script>

<button
  class="flex w-full flex-row items-center gap-2 text-base-content"
  on:click={() => {
    if (provider.id === $source.id) return;
    source.set(provider);
  }}
  bind:this={element}
>
  <img
    src={provider.logo}
    alt={provider.name}
    class="aspect-square h-20 rounded-md ring-2 transition-shadow duration-200
    {$source.id === provider.id ? 'ring-primary' : 'ring-transparent'}"
  />
  <div class="flex flex-col justify-start">
    <span class="inline-flex items-center gap-2">
      <h2 class="text-lg font-semibold">
        {provider.name}
      </h2>
      {#if provider.status != 'unknown'}
        <span
          class="badge badge-xs lowercase"
          class:badge-success={provider.status === 'working'}
          class:badge-error={provider.status === 'broken'}
        />
      {/if}
    </span>
    <p
      class="line-clamp-3 justify-start text-left text-xs font-light text-base-content/70"
    >
      {provider.description}
    </p>
  </div>
</button>

<SourceContextMenu {provider} {element} />
