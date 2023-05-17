import { error } from '@sveltejs/kit';
import { source } from '$lib/model/source';
import { animeCache, episodeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { Anime, EpisodeData } from '$lib/model/Anime';
import { downloads } from '$lib/model/downloads';

async function fetchAnime(id: string, _fetch: typeof fetch) {
  const anime = (await _fetch(
    `https://consumet.app.jet-black.xyz/meta/anilist/info/${id}?provider=${
      get(source).id
    }`,
    { signal: AbortSignal.timeout(15000) }
  )
    .then(r => {
      if (r.status !== 200) {
        console.error(r);
        throw error(404, 'Anime not found');
      }
      return r.json();
    })
    .catch(e => {
      console.error(e);
      throw error(404, 'Anime not found');
    })) as Anime;

  if (anime) {
    animeCache.set(id, anime);
  }

  return anime;
}

async function fetchEpisode(id: string, isDub: boolean, _fetch: typeof fetch) {
  const episode: EpisodeData = await _fetch(
    isDub
      ? `https://consumet.app.jet-black.xyz/meta/anilist/watch/${id}?provider=${
          get(source).id
        }&dub=true`
      : `https://consumet.app.jet-black.xyz/meta/anilist/watch/${id}?provider=${
          get(source).id
        }`
  )
    .then(r => {
      if (r.status !== 200) {
        console.error(r);
        throw error(404, 'Episode sources not found');
      }
      return r.json();
    })
    .catch(e => {
      console.error(e);
      throw error(404, 'Episode sources not found');
    });

  if (episode) {
    episodeCache.set(id, episode);
  } else {
    throw error(404, 'Episode sources not found');
  }

  return episode;
}

async function getDownload(id: string) {
  const download = get(downloads)[id];
  if (download) {
    const { convertFileSrc } = await import('@tauri-apps/api/tauri');
    return {
      ...download.episode,
      sources: download.episode.sources.map(source => ({
        ...source,
        url: convertFileSrc(source.url)
      }))
    } as EpisodeData;
  } else {
    return null;
  }
}

export const load = (async ({ fetch, depends, params, url }) => {
  depends(params.episode);

  // TODO: I have no clue where dub went on consumet api
  const isDub = url.searchParams.get('dub') === 'true';

  const anime =
    animeCache.get(params.id) ?? (await fetchAnime(params.id, fetch));
  const episode =
    (await getDownload(params.episode)) ??
    (isDub
      ? episodeCache.get(`${params.episode}/dub`)
      : episodeCache.get(params.episode)) ??
    (await fetchEpisode(params.episode, isDub, fetch));

  const episodeObject = anime.episodes.find(item => item.id === params.episode);

  if (!episodeObject) {
    throw error(404, 'Episode data not found');
  }

  return {
    anime,
    episode,
    id: params.episode,
    episodeObject,
    nextEpisode:
      anime.episodes[
        anime.episodes.findIndex(item => item.id === params.episode) + 1
      ]
  };
}) satisfies PageLoad;
