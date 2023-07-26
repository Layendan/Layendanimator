import { popularAnimes } from '$lib/model/cache';
import { fetchPopularAnime } from '$lib/model/fetch';
import { providers } from '$lib/model/source';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
  const source = get(providers)[params.source];

  if (!source) throw error(404, 'Source not found');

  async function update(page: number, perPage: number) {
    return await fetchPopularAnime(source, page, perPage);
  }

  return {
    data: popularAnimes.get(source.id) ?? fetchPopularAnime(source),
    update
  };
}) satisfies PageLoad;
