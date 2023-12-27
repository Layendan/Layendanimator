import {
  popularAnimes,
  recentEpisodes,
  trendingAnimes
} from '$lib/model/cache';
import {
  fetchPopularAnime,
  fetchRecentEpisodes,
  fetchTrendingAnime
} from '$lib/model/fetch';
import { providers } from '$lib/model/source';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ params, depends }) => {
  depends(`layendanimator:${params.source}`);

  const source = get(providers)[params.source];

  if (!source) error(404, 'Source not found');

  return {
    recent: {
      data: recentEpisodes.get(source.id) ?? fetchRecentEpisodes(source)
    },
    trending: {
      data: trendingAnimes.get(source.id) ?? fetchTrendingAnime(source)
    },
    popular: {
      data: popularAnimes.get(source.id) ?? fetchPopularAnime(source)
    },
    source
  };
}) satisfies PageLoad;
