import { popularAnimes } from '$lib/model/cache';
import { fetchPopularAnime } from '$lib/model/fetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  async function update(page: number, perPage: number) {
    return await fetchPopularAnime(fetch, { page, perPage });
  }

  return {
    data: popularAnimes.get(0) ?? fetchPopularAnime(fetch),
    update
  };
}) satisfies PageLoad;
