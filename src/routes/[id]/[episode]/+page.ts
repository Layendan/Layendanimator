import { source } from '$lib/model/source';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';

export const load = (async ({ fetch, params }) => {
  // TODO: Create store for episodes
  const episodes: Record<
    string,
    {
      watched: number;
      duration: number;
      lastWatched: string;
    }
  > = {};

  const anime: Anime = await fetch(
    `https://api.consumet.org/meta/anilist/info/${params.id}?provider=${
      get(source).id
    }`
  ).then(r => r.json());

  return {
    anime: anime,
    episode: (await fetch(
      `https://api.consumet.org/meta/anilist/watch/${params.episode}?provider=${
        get(source).id
      }`
    ).then(r => r.json())) as {
      sources: {
        url: string;
        isM3U8: boolean;
        quality: string;
      }[];
    },
    id: params.episode,
    episodeObject: anime.episodes.find(item => item.id === params.episode),
    nextEpisode:
      anime.episodes[
        anime.episodes.findIndex(item => item.id === params.episode) + 1
      ],
    store: episodes
  };
}) satisfies PageLoad;
