<script lang="ts">
  import { goto } from '$app/navigation';
  import { providers, source, type Provider } from '$lib/model/source';
  import SourceButtonButton from './SourceButtonButton.svelte';

  export let currentSrc: Provider;

  function blur() {
    (document.activeElement as HTMLElement | undefined)?.blur();
  }
</script>

<button
  tabindex="-1"
  class="dropdown"
  on:keydown={e => e.key === 'Escape' && blur()}
>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <label tabindex="0" class="btn btn-ghost w-52 bg-base-200 bg-opacity-30">
    <img
      src={currentSrc.logo}
      alt={currentSrc.name}
      class="h-5 w-5 rounded-md"
    />
    Change Source
  </label>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <ul
    tabindex="0"
    class="dropdown-content rounded-box z-10 mt-3 w-72 bg-base-100 p-4 shadow-xl"
  >
    <div class="max-h-96 overflow-y-scroll overscroll-contain">
      {#each Object.values($providers) as provider (provider.id)}
        <li class="m-1">
          <SourceButtonButton {provider} />

          <div class="divider my-1" />
        </li>
      {/each}
    </div>

    <button
      class="btn btn-primary btn-block mt-1"
      on:click={() =>
        window.location.pathname === `/${$source.id}`
          ? blur()
          : goto(`/${$source.id}`)}
    >
      Done
    </button>
  </ul>
</button>
