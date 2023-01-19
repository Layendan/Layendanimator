import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  return await fetch(
    `https://api.consumet.org/meta/anilist/watch/${params.episode}`
  ).then(r => r.json());
}) satisfies PageLoad;
