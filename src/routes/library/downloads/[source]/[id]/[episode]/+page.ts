import { convertAnime, downloads, getDownload } from '$lib/model/downloads';
import { providers } from '$lib/model/source';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ depends, params }) => {
  depends(`/downloads/${params.source}/${params.id}/${params.episode}`);

  const source = get(providers)[params.source];

  if (!source) throw error(404, 'Source not found');

  const download = get(downloads)[`${source.id}/${params.id}`];

  if (!download) {
    throw redirect(300, '/library');
  }

  const [anime, episode] = await Promise.all([
    convertAnime(download.anime),
    getDownload(params.id, params.episode, source)
  ]);

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
