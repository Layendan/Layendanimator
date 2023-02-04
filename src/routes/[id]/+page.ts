import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';
import { source } from '$lib/model/source';
import { get } from 'svelte/store';

export const load = (async ({ fetch, params }) => {
  const anime: Anime = await fetch(
    `https://api.consumet.org/meta/anilist/info/${params.id}?provider=${
      get(source).id
    }`,
    { signal: AbortSignal.timeout(15000) }
  ).then(r => r.json());

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
    anime: anime,
    store: episodes
  };
}) satisfies PageLoad;
