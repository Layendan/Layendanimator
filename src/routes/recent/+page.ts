import { recentEpisodes } from '$lib/model/cache';
import { fetchRecentEpisodes } from '$lib/model/fetch';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  async function update(page: number, perPage: number) {
    return await fetchRecentEpisodes(fetch, { page, perPage });
  }

  return {
    data: recentEpisodes.get(0) ?? fetchRecentEpisodes(fetch),
    update
  };
}) satisfies PageLoad;
