import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { EpisodeData } from '$lib/model/Anime';
import { downloadedAnimes, downloads } from '$lib/model/downloads';

async function getDownload(id: string) {
  const { convertFileSrc } = await import('@tauri-apps/api/tauri');
  const download = get(downloads)[id];
  if (download) {
    return {
      ...download.episode,
      sources: download.episode.sources.map(source => ({
        ...source,
        url: convertFileSrc(source.url)
      })),
      subtitles: download.episode.subtitles?.map(subtitle => ({
        ...subtitle,
        url: convertFileSrc(subtitle.url)
      }))
    } as EpisodeData;
  } else {
    return null;
  }
}

export const load = (async ({ depends, params }) => {
  depends(`/downloads/${params.id}`);

  const download = get(downloadedAnimes).find(
    download => download.anime.id === params.id
  );

  if (!download) {
    throw redirect(300, '/library');
  }

  const anime = download.anime;

  const episode = await getDownload(params.episode);

  const episodeObject = anime.episodes.find(item => item.id === params.episode);

  if (!episodeObject || !episode) {
    throw error(404, 'Episode data not found');
  }

  return {
    anime: {
      ...anime,
      episodes: anime.episodes.filter(episode =>
        download.episodes.find(dEpisode => dEpisode.number === episode.number)
      )
    },
    episode,
    id: params.episode,
    episodeObject,
    nextEpisode:
      anime.episodes[
        anime.episodes.findIndex(item => item.id === params.episode) + 1
      ]
  };
}) satisfies PageLoad;
