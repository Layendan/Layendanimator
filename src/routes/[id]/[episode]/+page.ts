import type { PageLoad } from './$types';
import { source } from '$lib/model/source';
import type { Anime } from '$lib/model/Anime';
import { get } from 'svelte/store';

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

  return {
    anime: (await fetch(
      `https://api.consumet.org/meta/anilist/info/${params.id}?provider=${
        get(source).id
      }`
    ).then(r => r.json())) as Anime,
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
    store: episodes
  };
}) satisfies PageLoad;
