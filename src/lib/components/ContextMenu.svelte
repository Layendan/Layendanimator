<script lang="ts">
  import { currentContextMenu } from '$lib/model/contextmenu';
  import {
    createEventDispatcher,
    onDestroy,
    onMount,
    setContext
  } from 'svelte';
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

  onMount(() => {
    document.getElementById('main')?.addEventListener('scroll', onScroll);
  });

  onDestroy(() => {
    menuEl?.remove();
    document.getElementById('main')?.removeEventListener('scroll', onScroll);
  });
</script>

<svelte:body on:click={onPageClick} />

<svelte:document
  on:visibilitychange={() => {
    if (document.visibilityState === 'hidden') dispatch('clickoutside');
  }}
/>

<div
  transition:fade={{ duration: 200 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
  class="menu menu-sm fixed z-50 w-52 rounded-box border-2 border-solid border-neutral/20 bg-base-200 shadow-lg"
>
  <slot />
</div>
