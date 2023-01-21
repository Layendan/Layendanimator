import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  return {
    anime: await fetch(
      `https://api.consumet.org/meta/anilist/info/${params.id}`
    ).then(r => r.json()),
    episode: await fetch(
      `https://api.consumet.org/meta/anilist/watch/${params.episode}`
    ).then(r => r.json())
  };
}) satisfies PageLoad;
