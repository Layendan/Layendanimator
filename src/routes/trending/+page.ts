import { trendingAnimes } from '$lib/model/cache';
import { fetchTrendingAnime } from '$lib/model/fetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  async function update(page: number, perPage: number) {
    return await fetchTrendingAnime(fetch, { page, perPage });
  }

  return {
    data: trendingAnimes.get(0) ?? fetchTrendingAnime(fetch),
    update
  };
}) satisfies PageLoad;
