import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';

function toUpperCase(value: string): string {
  return value.replace(/\b\w/g, c => c.toUpperCase());
}

export const load = (async ({ fetch, url }) => {
  let query = url.searchParams.get('q');
  if (!query) return;
  query = toUpperCase(query);
  const animes: Anime[] = (
    await fetch(`https://api.consumet.org/meta/anilist/${query}`).then(r =>
      r.json()
    )
  ).results;
  return {
    animes: animes,
    query: query
  };
}) satisfies PageLoad;
