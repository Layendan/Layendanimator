import { searchCache } from '$lib/model/cache';
import { fetchSearch } from '$lib/model/fetch';
import { providers } from '$lib/model/source';
import { toUpperCase } from '$lib/model/util';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (({ url }) => {
  const query = url.searchParams.get('q');
  if (!query) error(400, 'No query provided');
  const formattedQuery = toUpperCase(decodeURIComponent(query).trim());

  return {
    responses: Object.values(get(providers)).map(source => {
      return {
        source: source,
        results:
          get(searchCache)[source.id]?.get(formattedQuery) ??
          fetchSearch(formattedQuery, source)
      };
    }),
    query
  };
}) satisfies PageLoad;
