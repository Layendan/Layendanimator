import { searchCache } from '$lib/model/cache';
import { fetchSearch } from '$lib/model/fetch';
import { providers } from '$lib/model/source';
import { toUpperCase } from '$lib/model/util';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ url, params }) => {
  const query = url.searchParams.get('q');
  if (!query) throw error(400, 'No query provided');
  const formattedQuery = toUpperCase(decodeURIComponent(query).trim());

  const source = get(providers)[params.source];
  if (!source) throw error(404, 'Source not found');

  async function update(page: number, perPage: number) {
    return await fetchSearch(formattedQuery, source, page, perPage);
  }

  return {
    animes:
      get(searchCache)[source.id]?.get(formattedQuery) ??
      fetchSearch(formattedQuery, source),
    source,
    query: formattedQuery,
    update
  };
}) satisfies PageLoad;
