<script lang="ts">
  import type { Anime } from '$lib/model/classes/Anime';
  import { currentContextMenu } from '$lib/model/contextmenu';
  import { downloading, downloads } from '$lib/model/downloads';
  import { fetchAnime } from '$lib/model/fetch';
  import { notifications } from '$lib/model/notifications';
  import { encodeAnimeLink } from '$lib/model/source';
  import {
    subscriptions,
    unwatchedSubscriptions
  } from '$lib/model/subscriptions';
  import { watching } from '$lib/model/watch';
  import {
    faArrowRotateRight,
    faCloudDownload,
    faDownload,
    faExternalLink,
    faInfoCircle,
    faMinusCircle,
    faPlayCircle,
    faPlusCircle,
    faShare,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import ContextMenu from './ContextMenu.svelte';

  export let anime: Pick<Anime, 'id' | 'title' | 'image' | 'source'> &
    Partial<Anime>;
  export let element: HTMLElement;
  export let isDownload = false;

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
      <a
        href={isDownload
          ? `/library/downloads/${anime.source.id}/${anime.id}?autoplay=true`
          : `/${anime.source.id}/${anime.id}?autoplay=true`}
      >
        <Fa icon={faPlayCircle} class="h-3 w-3 text-accent" />
        Watch
      </a>
    </li>

    <li>
      <a
        href={isDownload
          ? `/library/downloads/${anime.source.id}/${anime.id}`
          : `/${anime.source.id}/${anime.id}`}
      >
        <Fa icon={faInfoCircle} class="h-3 w-3" />
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
          <Fa icon={faExternalLink} class="h-3 w-3" />
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
          <Fa icon={faShare} class="h-3 w-3" />
          Share
        </button>
      </li>
    {/if}

    <div class="divider my-0" />

    {#if $subscriptions[`${anime.source.id}/${anime.id}`]}
      <li>
        <button on:click|stopPropagation={() => subscriptions.remove(anime)}>
          <Fa icon={faMinusCircle} class="h-3 w-3" />
          Remove Subscription
        </button>
      </li>

      <li>
        <button
          on:click|stopPropagation={async () => {
            try {
              await fetchAnime(anime.id, anime.source);
              notifications.addNotification({
                title: 'Updated',
                message: `Anime info updated for ${
                  anime.title.english ?? anime.title.romaji
                }`
              });
            } catch (e) {
              console.error(e);
              notifications.addNotification({
                title: 'Error',
                message: 'Could not update anime info',
                type: 'error'
              });
            }
          }}
        >
          <Fa icon={faArrowRotateRight} class="h-3 w-3" />
          Check For Updates
        </button>
      </li>
    {:else if $unwatchedSubscriptions[`${anime.source.id}/${anime.id}`]}
      <li>
        <button
          on:click|stopPropagation={() => unwatchedSubscriptions.remove(anime)}
        >
          <Fa icon={faMinusCircle} class="h-3 w-3" />
          Remove Subscription
        </button>
      </li>

      <li>
        <button
          on:click|stopPropagation={async () => {
            try {
              await fetchAnime(anime.id, anime.source);
              notifications.addNotification({
                title: 'Updated',
                message: `Anime info updated for ${
                  anime.title.english ?? anime.title.romaji
                }`
              });
            } catch (e) {
              console.error(e);
              notifications.addNotification({
                title: 'Error',
                message: 'Could not update anime info',
                type: 'error'
              });
            }
          }}
        >
          <Fa icon={faArrowRotateRight} class="h-3 w-3" />
          Check For Updates
        </button>
      </li>
    {:else}
      <li>
        <button
          on:click|stopPropagation={async () => {
            subscriptions.add(anime);
            const res = await fetchAnime(anime.id, anime.source);
            if (!res) {
              subscriptions.remove(anime);
              return;
            }
            subscriptions.add(res);
          }}
        >
          <Fa icon={faPlusCircle} class="h-3 w-3 text-success" />
          Add Subscription
        </button>
      </li>
    {/if}

    {#if $watching[`${anime.source.id}/${anime.id}`]}
      <div class="divider my-0" />

      <li>
        <button on:click|stopPropagation={() => watching.remove(anime)}>
          <Fa icon={faTrash} class="h-3 w-3" />
          Clear Watch History
        </button>
      </li>

      <li>
        <button
          on:click|stopPropagation={async () => {
            try {
              const res = await fetchAnime(anime.id, anime.source);
              if (!res) throw new Error('Could not find anime');

              watching.updateAnime(res);
              notifications.addNotification({
                title: 'Updated',
                message: `Anime info updated for ${
                  res.title.english ?? res.title.romaji
                }`
              });
            } catch (e) {
              console.error(e);
              notifications.addNotification({
                title: 'Error',
                message: 'Could not update anime info',
                type: 'error'
              });
            }
          }}
        >
          <Fa icon={faCloudDownload} class="-mx-[2px] h-4 w-4" />
          Update Watch Info
        </button>
      </li>
    {/if}

    {#if window?.__TAURI__}
      <div class="divider my-0" />

      <li>
        <button
          on:click|stopPropagation={async () => {
            const res = await fetchAnime(anime.id, anime.source);
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
          <Fa icon={faDownload} class="h-3 w-3" />
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
          <Fa icon={faTrash} class="h-3 w-3 text-error" />
          Remove Downloads
        </button>
      </li>
    {/if}
  </ContextMenu>
{/if}
