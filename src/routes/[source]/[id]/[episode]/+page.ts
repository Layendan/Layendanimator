import { animeCache, episodeCache } from '$lib/model/cache';
import type { EpisodeData } from '$lib/model/classes/Anime';
import { getDownload } from '$lib/model/downloads';
import { fetchAnime, fetchEpisode } from '$lib/model/fetch';
import { notifications } from '$lib/model/notifications';
import { providers } from '$lib/model/source';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ depends, params }) => {
  depends(`${params.source}:${params.id}:${params.episode}`);
  depends(`downloads:${params.source}:${params.id}:${params.episode}`);

  const source = get(providers)[params.source];

  if (!source) error(404, 'Source not found');

  const [anime, downloadedEpisode, newEpisode] = await Promise.all([
    animeCache.get(`${source.id}/${params.id}`) ??
      fetchAnime(params.id, source),
    getDownload(params.id, params.episode, source),
    episodeCache.get(`${source.id}/${params.episode}`) ??
      fetchEpisode(params.episode, source)
  ]);

  const episodeObject = anime.episodes.find(item => item.id === params.episode);

  if (!episodeObject) {
    notifications.addNotification({
      title: 'Episode data not found',
      message: `The episode with id ${params.episode} was not found.`,
      type: 'error'
    });
    error(404, 'Episode data not found');
  }

  const newDownloadedEpisode: EpisodeData = {
    ...(downloadedEpisode ?? {}),
    sources:
      downloadedEpisode?.sources.map(source => ({
        ...source,
        quality: 'download'
      })) ?? []
  };

  const episode: EpisodeData = {
    ...newEpisode,
    ...(newDownloadedEpisode ?? []),
    sources: [...(newDownloadedEpisode?.sources ?? []), ...newEpisode.sources],
    subtitles: [
      ...(newDownloadedEpisode?.subtitles ?? []),
      ...(newEpisode.subtitles ?? [])
    ]
  };

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
