import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  return await fetch(
    `https://api.consumet.org/meta/anilist/info/${params.id}`
  ).then(r => r.json());
}) satisfies PageLoad;
