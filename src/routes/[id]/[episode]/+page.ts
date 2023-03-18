import { error } from '@sveltejs/kit';
import { source } from '$lib/model/source';
import { animeCache, episodeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';

async function fetchAnime(id: string, _fetch: typeof fetch) {
  const anime = (await _fetch(
    `https://consumet.app.jet-black.xyz/meta/anilist/info/${id}?provider=${
      get(source).id
    }`,
    { signal: AbortSignal.timeout(15000) }
  ).then(r => r.json())) as Anime;

  if (anime) {
    animeCache.set(id, anime);
  }

  return anime;
}

async function fetchEpisode(id: string, _fetch: typeof fetch) {
  const episode = (await _fetch(
    `https://api.consumet.org/meta/anilist/watch/${id}?provider=${
      get(source).id
    }`
  ).then(r => r.json())) as {
    sources: {
      url: string;
      isM3U8: boolean;
      quality: string;
    }[];
    download: string;
  };

  if (episode) {
    episodeCache.set(id, episode);
  }

  return episode;
}

export const load = (async ({ fetch, depends, params }) => {
  depends(params.episode);

  const anime =
    animeCache.get(params.id) ?? (await fetchAnime(params.id, fetch));
  const episode =
    episodeCache.get(params.episode) ??
    (await fetchEpisode(params.episode, fetch));

  // TODO: Create store for episodes
  const episodes: Record<
    string,
    {
      watched: number;
      duration: number;
      lastWatched: string;
    }
  > = {};

  const episodeObject = anime.episodes.find(item => item.id === params.episode);

  if (!episodeObject) {
    throw error(404, 'Episode not found');
  }

  return {
    anime,
    episode,
    id: params.episode,
    episodeObject,
    nextEpisode:
      anime.episodes[
        anime.episodes.findIndex(item => item.id === params.episode) + 1
      ],
    store: episodes
  };
}) satisfies PageLoad;
