import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  return {
    recent: (
      await fetch(
        'https://api.consumet.org/meta/anilist/recent-episodes?perPage=25'
      ).then(r => r.json())
    ).results,
    popular: (
      await fetch('https://api.consumet.org/meta/anilist/popular').then(r =>
        r.json()
      )
    ).results,
    trending: (
      await fetch(
        'https://api.consumet.org/meta/anilist/trending?perPage=25'
      ).then(r => r.json())
    ).results
  };
}) satisfies PageLoad;
