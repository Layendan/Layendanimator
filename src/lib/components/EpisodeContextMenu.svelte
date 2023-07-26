<script lang="ts">
  import type { Anime, Episode } from '$lib/model/classes/Anime';
  import { currentContextMenu } from '$lib/model/contextmenu';
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
    faStopCircle,
    faTrash
  } from '@fortawesome/free-solid-svg-icons';
  import { page } from '$app/stores';
  import { downloading, downloads } from '$lib/model/downloads';
  import { encodeEpisodeLink } from '$lib/model/source';

  export let anime: Anime;
  export let episode: Episode;
  export let element: HTMLElement;

  let pos = { x: 0, y: 0 };
  let showMenu = false;
  const id = crypto.randomUUID();

  async function onRightClick(e: MouseEvent) {
    e.preventDefault();

    if (showMenu) {
      showMenu = false;
      await new Promise(res => setTimeout(res, 100));
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

  $: title = episode.title || `Episode ${episode.number}`;
</script>

{#if showMenu}
  <ContextMenu {...pos} {id} on:click={closeMenu} on:clickoutside={closeMenu}>
    <h2
      class="menu-title w-full overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {title}
    </h2>

    <li>
      <a href={`/${anime.source.id}/${anime.id}/${episode.id}`}>
        <Fa icon={faPlayCircle} class="text-accent" />
        Watch
      </a>
    </li>

    {#if $page.url.pathname !== `/${anime.source.id}/${anime.id}`}
      <li>
        <a href={`/${anime.source.id}/${anime.id}`}>
          <Fa icon={faInfoCircle} />
          Anime Details
        </a>
      </li>
    {/if}

    {#if anime.source.shareLinks?.episode}
      <li>
        <a
          href={encodeEpisodeLink(anime, episode)}
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
            if (anime.source.shareLinks?.episode)
              navigator.share({
                title: `${anime.title.english ?? anime.title.romaji} - ${
                  episode.title ?? `Episode ${episode.number}`
                }`,
                text: `Watch ${anime.title.english ?? anime.title.romaji} - ${
                  episode.title ?? `Episode ${episode.number}`
                } on ${anime.source.name}`,
                url: encodeEpisodeLink(anime, episode)
              });
          }}
        >
          <Fa icon={faShare} />
          Share
        </button>
      </li>
    {/if}

    <div class="divider my-0" />

    {#if $watching[`${anime.source.id}/${anime.id}`]?.watchedEpisodes?.[episode.id]}
      <li>
        <button
          on:click|stopPropagation={() =>
            watching.removeEpisode(anime, episode.id)}
        >
          <Fa icon={faMinusCircle} />
          Mark as Unwatched
        </button>
      </li>
    {:else}
      <li>
        <button
          on:click|stopPropagation={() =>
            watching.watch(anime, { episode, time: 0, percentage: 1 })}
        >
          <Fa icon={faPlusCircle} />
          Mark as Watched
        </button>
      </li>
    {/if}

    {#if window?.__TAURI__ && !$page.params.episode}
      <div class="divider my-0" />

      {#if $downloads[`${anime.source.id}/${anime.id}`]?.episodes?.[episode.id]}
        <li>
          <button
            on:click|stopPropagation={() => downloads.remove(anime, episode.id)}
          >
            <Fa icon={faTrash} class="text-error" />
            Remove Download
          </button>
        </li>
      {:else if $downloading[`${anime.source.id}/${anime.id}/${episode.id}`]}
        <li>
          <button
            on:click|stopPropagation={() =>
              downloading.cancel(
                `${anime.source.id}/${anime.id}/${episode.id}`
              )}
          >
            <Fa icon={faStopCircle} class="text-warning" />
            Cancel Download
          </button>
        </li>
      {:else}
        <li>
          <button
            on:click|stopPropagation={() =>
              downloading.add(episode.id, anime, '1080p', episode.number)}
          >
            <Fa icon={faDownload} class="text-success" />
            Download Episode
          </button>
        </li>
      {/if}
    {/if}
  </ContextMenu>
{/if}
