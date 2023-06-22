import { error } from '@sveltejs/kit';
import { source } from '$lib/model/source';
import { animeCache, episodeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { Anime, EpisodeData } from '$lib/model/classes/Anime';
import { convertDownloads, downloads } from '$lib/model/downloads';
import { notifications } from '$lib/model/notifications';

async function fetchAnime(id: string, _fetch: typeof fetch) {
  let anime = (await _fetch(
    `https://consumet.app.jet-black.xyz/meta/anilist/info/${id}?provider=${
      get(source).id
    }`,
    { signal: AbortSignal.timeout(15000) }
  )
    .then(r => {
      if (r.status !== 200) {
        console.error(r);
        notifications.addNotification({
          title: 'Anime not found',
          message: `The anime with id ${id} was not found.`,
          type: 'error'
        });
        throw error(404, 'Anime not found');
      }
      return r.json();
    })
    .catch(e => {
      console.error(e);
      notifications.addNotification({
        title: 'Anime not found',
        message: `The anime with id ${id} was not found.`,
        type: 'error'
      });
      throw error(404, 'Anime not found');
    })) as Anime;

  if (anime) {
    anime = {
      ...anime,
      episodes: anime.episodes.sort((a, b) => a.number - b.number)
    };

    animeCache.set(id, anime);
  }

  return anime;
}

async function fetchEpisode(id: string, isDub: boolean, _fetch: typeof fetch) {
  let episode: EpisodeData = await _fetch(
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
        notifications.addNotification({
          title: 'Episode sources not found',
          message: `The episode with id ${id} was not found.`,
          type: 'error'
        });
        throw error(404, 'Episode sources not found');
      }
      return r.json();
    })
    .catch(e => {
      console.error(e);
      notifications.addNotification({
        title: 'Episode sources not found',
        message: `The episode with id ${id} was not found.`,
        type: 'error'
      });
      throw error(404, 'Episode sources not found');
    });

  if (episode) {
    episode = {
      ...episode,
      sources: episode.sources.map(source => ({
        ...source,
        url: `https://jb-proxy.app.jet-black.xyz/${source.url}`
      }))
    };

    episodeCache.set(id, episode);
  } else {
    notifications.addNotification({
      title: 'Episode sources not found',
      message: `The episode with id ${id} was not found.`,
      type: 'error'
    });
    throw error(404, 'Episode sources not found');
  }

  return episode;
}

async function getDownload(animeId: string, episodeId: string) {
  const download = get(downloads)[animeId]?.episodes?.[episodeId];
  if (download) {
    return await convertDownloads(download);
  } else {
    return undefined;
  }
}

export const load = (async ({ fetch, depends, params, url }) => {
  depends(params.episode);

  // TODO: I have no clue where dub went on consumet api
  const isDub = url.searchParams.get('dub') === 'true';

  const anime =
    animeCache.get(params.id) ?? (await fetchAnime(params.id, fetch));
  const episode =
    (await getDownload(params.id, params.episode)) ??
    (isDub
      ? episodeCache.get(`${params.episode}/dub`)
      : episodeCache.get(params.episode)) ??
    (await fetchEpisode(params.episode, isDub, fetch));

  const episodeObject = anime.episodes.find(item => item.id === params.episode);

  if (!episodeObject) {
    notifications.addNotification({
      title: 'Episode data not found',
      message: `The episode with id ${params.episode} was not found.`,
      type: 'error'
    });
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
