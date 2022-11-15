<script lang="ts">
  import { fade } from "svelte/transition";

  export let showModal: boolean;
  export let captureScroll: boolean = false;
  export let onDismiss: () => void = () => {};

  const duration: number = 300;
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === "Escape") {
      showModal = false;
      onDismiss();
      event.preventDefault();
    }
  }}
/>

<div class="modal" style:--duration="{duration / 1000}s">
  <div class="content" class:hidden={showModal}>
    <slot name="content" />
  </div>
  <!--<Content>-->
  {#if showModal}
    <div
      class="overlay"
      class:captureScroll
      transition:fade|local={{ duration: duration }}
      on:mousedown|self|preventDefault={(event) => {
        if (event.button === 0) {
          showModal = false;
          onDismiss();
        }
      }}
    />
    <div
      class="modal__content"
      in:fade|local={{ delay: duration - duration / 10 }}
      out:fade|local={{ duration: duration }}
    >
      <slot name="modalContent" />
    </div>
    <!--<Modal Content>-->
  {/if}
</div>

<style>
  .modal {
    width: 100%;
    height: 100%;
  }

  .content {
    width: 100%;
    height: 100%;
    transform: scale(1) translateY(0);
    -webkit-filter: blur(0);
    filter: blur(0);
    transition: transform var(--duration) ease-in-out;
  }

  .content.hidden {
    transform: scale(1.01);
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(var(--primary-rgb), 0.8);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    cursor: pointer;
    z-index: 100;
  }

  :global(body):has(.captureScroll) {
    overflow: hidden;
  }

  .modal__content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 101;
  }
</style>
