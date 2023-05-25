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
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  return {
    recent: {
      data: recentEpisodes.get(0) ?? fetchRecentEpisodes(fetch)
    },
    trending: {
      data: trendingAnimes.get(0) ?? fetchTrendingAnime(fetch)
    },
    popular: {
      data: popularAnimes.get(0) ?? fetchPopularAnime(fetch)
    }
  };
}) satisfies PageLoad;
