<script>
  let isHovered = false;
  let x;
  let y;

  function mouseOver(event) {
    isHovered = true;
    x = event.pageX + 5;
    y = event.pageY + 5;
  }
  function mouseMove(event) {
    x = event.pageX + 5;
    y = event.pageY + 5;
  }
  function mouseLeave() {
    isHovered = false;
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
  on:mousemove={mouseMove}
>
  <slot name="content" />
</div>

{#if isHovered}
  <div style="top: {y}px; left: {x}px;" class="tooltip">
    <slot name="tooltip" />
  </div>
{/if}

<style>
  .tooltip {
    border: 1px solid var(--secondary-color);
    box-shadow: 1px 1px 1px var(--secondary-color);
    background: var(--primary-color);
    border-radius: 4px;
    padding: 4px;
    position: absolute;
  }
</style>
