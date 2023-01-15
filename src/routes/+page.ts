import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  return {
    recent: (
      await fetch('https://api.consumet.org/meta/anilist/recent-episodes').then(
        r => r.json()
      )
    ).results,
    popular: (
      await fetch('https://api.consumet.org/meta/anilist/popular').then(r =>
        r.json()
      )
    ).results,
    trending: (
      await fetch('https://api.consumet.org/meta/anilist/trending').then(r =>
        r.json()
      )
    ).results
  };
}) satisfies PageLoad;
