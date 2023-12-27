import { convertAnime, downloads } from '$lib/model/downloads';
import { providers } from '$lib/model/source';
import { watching } from '$lib/model/watch';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ depends, params, url }) => {
  depends(`downloads:${params.source}:${params.id}`);

  const source = get(providers)[params.source];

  if (!source) error(404, 'Source not found');

  const download = get(downloads)[`${source.id}/${params.id}`];

  if (!download) {
    redirect(302, '/library');
  }

  const anime = await convertAnime(download.anime);

  if (url.searchParams.get('autoplay') === 'true') {
    const data = get(watching)[`${params.source}/${params.id}`];
    const watchPercentage = 0.8;
    const nextEpisode =
      data?.watchEpisode?.number &&
      (data.watchedEpisodes[data.watchEpisode.id]?.percentage ?? 0) >=
        watchPercentage
        ? anime.episodes.find(
            episode => episode.number === data?.watchEpisode?.number + 1
          ) ??
          data.watchEpisode ??
          anime.episodes[0]
        : data?.watchEpisode ?? anime.episodes[0];
    const lastEpisode = anime.episodes.at(-1);
    const hasLastEpisode = data?.watchEpisode?.id === lastEpisode?.id;
    const lastEpisodeFinished =
      lastEpisode &&
      (data?.watchedEpisodes[`${anime.source.id}/${lastEpisode.id}`]
        ?.percentage ?? 0) >= watchPercentage;
    const href = `/library/downloads/${anime.source.id}/${anime.id}/${
      hasLastEpisode && lastEpisodeFinished
        ? anime.episodes[0].id
        : nextEpisode.id
    }`;

    redirect(302, href);
  }

  return anime;
}) satisfies PageLoad;
