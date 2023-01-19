import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';

export const load = (async ({ fetch, params }) => {
  const anime: Anime = await fetch(
    `https://api.consumet.org/meta/anilist/info/${params.id}`
  ).then(r => r.json());
  return anime;
}) satisfies PageLoad;
