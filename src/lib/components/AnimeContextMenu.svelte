<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { currentContextMenu } from '$lib/model/contextmenu';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';
  import Fa from 'svelte-fa';
  import ContextMenu from './ContextMenu.svelte';
  import {
    faDownload,
    faExternalLink,
    faInfoCircle,
    faMinusCircle,
    faPlayCircle,
    faPlusCircle,
    faShare,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import { preloadData } from '$app/navigation';
  import { animeCache } from '$lib/model/cache';
  import { downloading, downloads } from '$lib/model/downloads';
  import { encodeAnimeLink } from '$lib/model/source';
  import { notifications } from '$lib/model/notifications';

  export let anime: Anime;
  export let element: HTMLElement;

  let pos = { x: 0, y: 0 };
  let showMenu = false;
  const id = crypto.randomUUID();

  async function onRightClick(e: MouseEvent) {
    e.preventDefault();

    if (showMenu) {
      showMenu = false;
      await new Promise(res => setTimeout(res, 200));
    }

    pos = { x: e.clientX, y: e.clientY };
    showMenu = true;
  }

  $: if (id !== $currentContextMenu) showMenu = false;

  async function closeMenu() {
    showMenu = false;
    currentContextMenu.set(undefined);
  }

  $: element && element.addEventListener('contextmenu', onRightClick);

  $: title = anime.title.english ?? anime.title.romaji;
</script>

{#if showMenu}
  <ContextMenu {...pos} {id} on:click={closeMenu} on:clickoutside={closeMenu}>
    <h2
      class="menu-title w-full overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {title}
    </h2>

    <li>
      <a href={`/${anime.source.id}/${anime.id}?autoplay=true`}>
        <Fa icon={faPlayCircle} class="text-accent" />
        Watch
      </a>
    </li>

    <li>
      <a href={`/${anime.source.id}/${anime.id}`}>
        <Fa icon={faInfoCircle} />
        Details
      </a>
    </li>

    {#if anime.source.shareLinks?.anime}
      <li>
        <a
          href={encodeAnimeLink(anime)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Fa icon={faExternalLink} />
          Open in Browser
        </a>
      </li>

      <li>
        <button
          on:click={() => {
            if (anime.source.shareLinks?.anime)
              navigator.share({
                title: anime.title.english ?? anime.title.romaji,
                text: `Watch ${anime.title.english ?? anime.title.romaji} on ${
                  anime.source.name
                }`,
                url: encodeAnimeLink(anime)
              });
          }}
        >
          <Fa icon={faShare} />
          Share
        </button>
      </li>
    {/if}

    <div class="divider my-0" />

    {#if $subscriptions[`${anime.source.id}/${anime.id}`]}
      <li>
        <button on:click|stopPropagation={() => subscriptions.remove(anime)}>
          <Fa icon={faMinusCircle} />
          Remove Subscription
        </button>
      </li>
    {:else if $unwatchedSubscriptions[`${anime.source.id}/${anime.id}`]}
      <li>
        <button
          on:click|stopPropagation={() => unwatchedSubscriptions.remove(anime)}
        >
          <Fa icon={faMinusCircle} />
          Remove Subscription
        </button>
      </li>
    {:else}
      <li>
        <button
          on:click|stopPropagation={async () => {
            subscriptions.add(anime);
            await preloadData(`${anime.source.id}/${anime.id}`);
            const res = animeCache.get(`${anime.source.id}/${anime.id}`);
            if (!res) {
              subscriptions.remove(anime);
              return;
            }
            subscriptions.add(res);
          }}
        >
          <Fa icon={faPlusCircle} class="text-success" />
          Add Subscription
        </button>
      </li>
    {/if}

    {#if $watching[`${anime.source.id}/${anime.id}`]}
      <div class="divider my-0" />

      <li>
        <button on:click|stopPropagation={() => watching.remove(anime)}>
          <Fa icon={faTrash} />
          Clear Watch History
        </button>
      </li>
    {/if}

    {#if window?.__TAURI__}
      <div class="divider my-0" />

      <li>
        <button
          on:click|stopPropagation={async () => {
            await preloadData(`${anime.source.id}/${anime.id}`);
            const res = animeCache.get(`${anime.source.id}/${anime.id}`);
            if (!res) return;

            notifications.addNotification({
              title: 'Downloading episodes...',
              message: `Downloading episodes for ${
                res.title.english ?? res.title.romaji
              }`,
              type: 'info'
            });

            res.episodes.forEach(episode =>
              downloading.add(episode.id, res, '1080p', episode.number)
            );
          }}
        >
          <Fa icon={faDownload} />
          Download Episodes
        </button>
      </li>
      <li>
        <button
          on:click|stopPropagation={async () => {
            const { confirm } = await import('@tauri-apps/api/dialog');
            const confirmed = await confirm(
              'This action cannot be reverted. Are you sure?',
              {
                title: 'Delete All Downloaded Episodes',
                type: 'warning',
                okLabel: "Yes, I'm Sure"
              }
            );

            if (confirmed)
              Object.keys(
                $downloads[`${anime.source.id}/${anime.id}`].episodes
              ).forEach(episode => downloads.remove(anime, episode));
          }}
        >
          <Fa icon={faTrash} class="text-error" />
          Remove Downloads
        </button>
      </li>
    {/if}
  </ContextMenu>
{/if}
