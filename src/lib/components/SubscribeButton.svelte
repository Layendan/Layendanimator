<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';

  export let anime: Anime;

  $: id = `${anime.source.id}/${anime.id}`;
  $: subscribed = $subscriptions[id] || $unwatchedSubscriptions[id];
</script>

<button
  class="btn mt-4 w-full shadow-xl backdrop-blur-xl {subscribed
    ? 'btn-error btn-outline'
    : 'btn-primary'}"
  on:click={() => {
    if (subscribed) {
      subscriptions.remove(anime);
      unwatchedSubscriptions.remove(anime);
    } else {
      subscriptions.add(anime);
    }
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="mr-2"
  >
    {#if subscribed}
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    {:else}
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    {/if}
  </svg>
  Subscriptions
</button>
