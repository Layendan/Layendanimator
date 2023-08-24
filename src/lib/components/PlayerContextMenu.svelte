<script lang="ts">
  import type { Anime, Episode } from '$lib/model/classes/Anime';
  import { currentContextMenu } from '$lib/model/contextmenu';
  import { notifications } from '$lib/model/notifications';
  import { encodeEpisodeLink } from '$lib/model/source';
  import {
    faArrowAltCircleRight,
    faBackward,
    faBackwardFast,
    faCompress,
    faExpand,
    faExternalLink,
    faForward,
    faForwardFast,
    faInfoCircle,
    faPauseCircle,
    faPlayCircle,
    faShare
  } from '@fortawesome/free-solid-svg-icons';
  import { onDestroy, onMount } from 'svelte';
  import Fa from 'svelte-fa';
  import type { MediaPlayerElement } from 'vidstack';
  import { defineCustomElements } from 'vidstack/elements';
  import ContextMenu from './ContextMenu.svelte';

  export let anime: Anime;
  export let episode: Episode;
  export let element: MediaPlayerElement;
  export let requestNextEpisode: () => void;

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

  $: title = episode.title ?? `Episode ${episode.number}`;

  let statePaused = false;
  let stateFullscreen = false;

  let unsubPaused: () => void;
  let unsubFullscreen: () => void;
  let unsubUserIdle: () => void;

  onMount(async () => {
    await defineCustomElements();
    element.onAttach(() => {
      unsubPaused = element.subscribe(({ paused }) => {
        statePaused = paused;
      });

      unsubFullscreen = element.subscribe(({ fullscreen }) => {
        stateFullscreen = fullscreen;
      });

      unsubUserIdle = element.subscribe(({ userIdle }) => {
        if (userIdle) {
          closeMenu();
          element.focus();
        }
      });
    });
  });

  onDestroy(() => {
    unsubPaused?.();
    unsubFullscreen?.();
    unsubUserIdle?.();
  });
</script>

{#if showMenu}
  <ContextMenu
    {...pos}
    {id}
    global={!stateFullscreen}
    on:click={closeMenu}
    on:clickoutside={closeMenu}
  >
    <h2
      class="menu-title w-full overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {title}
    </h2>

    <span class="mx-auto inline-flex">
      <li>
        <button
          on:click={() => {
            element.currentTime = Math.max(element.currentTime - 15, 0);
          }}
        >
          <Fa icon={faBackwardFast} />
        </button>
      </li>

      <li>
        <button
          on:click={() => {
            element.currentTime = Math.max(element.currentTime - 5, 0);
          }}
        >
          <Fa icon={faBackward} />
        </button>
      </li>

      <li>
        <button
          on:click={() => (statePaused ? element.play() : element.pause())}
        >
          <Fa
            icon={statePaused ? faPlayCircle : faPauseCircle}
            class="text-success"
          />
        </button>
      </li>

      <li>
        <button
          on:click={() => {
            element.currentTime = Math.min(
              element.currentTime + 5,
              element.state.duration
            );
          }}
        >
          <Fa icon={faForward} />
        </button>
      </li>

      <li>
        <button
          on:click={() => {
            element.currentTime = Math.min(
              element.currentTime + 15,
              element.state.duration
            );
          }}
        >
          <Fa icon={faForwardFast} />
        </button>
      </li>
    </span>

    <div class="divider my-0" />

    <li>
      <button
        on:click={async () => {
          try {
            stateFullscreen
              ? element.exitFullscreen()
              : await element.requestFullscreen({ navigationUI: 'hide' });
            closeMenu();
          } catch (e) {
            notifications.addNotification({
              title: 'Fullscreen Error',
              message: 'Fullscreen is not supported on this device.',
              type: 'error'
            });
            console.error(e);
          }
        }}
      >
        <Fa icon={stateFullscreen ? faCompress : faExpand} />
        Fullscreen
      </button>
    </li>

    <div class="divider my-0" />

    <li>
      <button on:click={requestNextEpisode}>
        <Fa icon={faArrowAltCircleRight} class="text-accent" />
        Play Next Episode
      </button>
    </li>

    <li>
      <a href={`/${anime.source.id}/${anime.id}`}>
        <Fa icon={faInfoCircle} />
        Details
      </a>
    </li>

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
  </ContextMenu>
{/if}
