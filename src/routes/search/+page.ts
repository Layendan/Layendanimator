import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';

export function _toUpperCase(value: string): string {
  return value.replace(/\b\w/g, c => c.toUpperCase());
}

export const load = (async ({ fetch, url }) => {
  let query = url.searchParams.get('q');
  if (!query) return;
  query = _toUpperCase(query.trim());
  const animes: Anime[] = (
    await fetch(
      `https://consumet.app.jet-black.xyz/meta/anilist/${query}`
    ).then(r => r.json())
  ).results;
  return {
    animes: animes,
    query: query
  };
}) satisfies PageLoad;
