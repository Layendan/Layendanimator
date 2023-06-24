<script lang="ts">
  import { notifications } from '$lib/model/notifications';
  import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimesCircle
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { fade, fly } from 'svelte/transition';

  $: if ($notifications[0]) {
    const id = $notifications[0].id;
    setTimeout(() => {
      if ($notifications[0].id === id)
        notifications.removeNotification($notifications[0].id);
    }, $notifications[0].dismissAfter ?? 5000);
  }
</script>

<div class="stack fixed left-4 right-4 top-16 z-50">
  {#each $notifications as notification (notification.id)}
    {#if notification.show}
      <button
        class="alert relative my-1 h-min shadow-md transition-[width_height] duration-300 ease-in-out"
        class:alert-info={notification.type === 'info'}
        class:alert-success={notification.type === 'success'}
        class:alert-warning={notification.type === 'warning'}
        class:alert-error={notification.type === 'error'}
        in:fly={{ y: 10 }}
        out:fly={{ y: -10 }}
        on:click={() => {
          notifications.removeNotification(notification.id);
        }}
      >
        {#if notification.type === 'info'}
          <Fa icon={faInfoCircle} size="1x" class="text-info-content" />
        {:else if notification.type === 'success'}
          <Fa icon={faCheckCircle} size="1x" class="text-success-content" />
        {:else if notification.type === 'warning'}
          <Fa
            icon={faExclamationCircle}
            size="1x"
            class="text-warning-content"
          />
        {:else if notification.type === 'error'}
          <Fa icon={faTimesCircle} size="1x" class="text-error-content" />
        {/if}
        <h2>{notification.title}</h2>
        <p class="text-xs">{notification.message}</p>
        {#if notification.progress > 0}
          <progress
            class="progress absolute bottom-2 left-4 right-4 h-1 w-[calc(100%-2rem)]"
            max="100"
            value={notification.progress}
            in:fade
          />
        {/if}
      </button>
    {/if}
  {/each}
</div>
