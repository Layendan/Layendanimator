import { recentEpisodes } from '$lib/model/cache';
import { fetchRecentEpisodes } from '$lib/model/fetch';
import { providers } from '$lib/model/source';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
  const source = get(providers)[params.source];

  if (!source) throw error(404, 'Source not found');

  async function update(page: number, perPage: number) {
    return await fetchRecentEpisodes(source, page, perPage);
  }

  return {
    data: recentEpisodes.get(source.id) ?? fetchRecentEpisodes(source),
    update
  };
}) satisfies PageLoad;
