<script lang="ts">
  import { currentContextMenu } from '$lib/model/contextmenu';
  import { createEventDispatcher, onDestroy, setContext } from 'svelte';
  import { fade } from 'svelte/transition';

  export let x: number;
  export let y: number;
  export let id: string;
  export let global = true;

  // whenever x and y is changed, restrict box to be within bounds
  $: (x || y) &&
    (() => {
      if (!menuEl) return;
      currentContextMenu.set(id);

      const rect = menuEl.getBoundingClientRect();
      x = Math.min(window.innerWidth - rect.width, x);
      if (y > window.innerHeight - rect.height) y -= rect.height;
    })();

  const dispatch = createEventDispatcher();

  setContext(
    {},
    {
      dispatchClick: () => dispatch('click')
    }
  );

  let menuEl: HTMLDivElement;

  function onPageClick(e: MouseEvent) {
    if ((e.target as Node) === menuEl || menuEl.contains(e.target as Node))
      return;
    dispatch('clickoutside');
  }

  function onScroll() {
    dispatch('clickoutside');
  }

  $: menuEl && global && document.body.append(menuEl);

  onDestroy(() => {
    menuEl?.remove();
  });
</script>

<svelte:body on:click={onPageClick} />

<svelte:window on:scroll={onScroll} />

<svelte:document
  on:visibilitychange={() => {
    if (document.visibilityState === 'hidden') dispatch('clickoutside');
  }}
/>

<div
  transition:fade={{ duration: 200 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
  class="menu rounded-box menu-sm fixed z-50 w-52 border-2 border-solid border-neutral/20 bg-base-200 shadow-lg"
>
  <slot />
</div>
