import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import {
  convertAnime,
  convertDownloads,
  downloads
} from '$lib/model/downloads';
import type { EpisodeData } from '$lib/model/classes/Anime';

async function getDownload(download: EpisodeData) {
  if (download) {
    return await convertDownloads(download);
  } else {
    return undefined;
  }
}

export const load = (async ({ depends, params }) => {
  depends(`/downloads/${params.id}`);

  const download = get(downloads)[params.id];

  if (!download) {
    throw redirect(300, '/library');
  }

  const anime = await convertAnime(download.anime);

  const episode = await getDownload(download.episodes[params.episode]);

  const episodeObject = anime.episodes.find(({ id }) => id === params.episode);

  console.debug(anime);
  console.debug(episode);
  console.debug(episodeObject);

  if (!episodeObject || !episode) {
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
