import {
  popularAnimes,
  recentEpisodes,
  trendingAnimes
} from '$lib/model/cache';
import type { Anime } from '$lib/model/Anime';
import type { PageLoad } from './$types';

async function fetchRecentEpisodes(_fetch: typeof fetch) {
  const recent = (
    await _fetch(
      'https://consumet.app.jet-black.xyz/meta/anilist/recent-episodes?perPage=25',
      { signal: AbortSignal.timeout(15_000) }
    ).then(r => r.json())
  ).results as Anime[];
  recentEpisodes.set(null, recent);
  return recent;
}

async function fetchTrendingAnime(_fetch: typeof fetch) {
  const trending = (
    await _fetch(
      'https://consumet.app.jet-black.xyz/meta/anilist/trending?perPage=25',
      {
        signal: AbortSignal.timeout(15_000)
      }
    ).then(r => r.json())
  ).results as Anime[];
  trendingAnimes.set(null, trending);
  return trending;
}

async function fetchPopularAnime(_fetch: typeof fetch) {
  const popular = (
    await _fetch('https://consumet.app.jet-black.xyz/meta/anilist/popular', {
      signal: AbortSignal.timeout(15_000)
    }).then(r => r.json())
  ).results as Anime[];
  popularAnimes.set(null, popular);
  return popular;
}

export const load = (async ({ fetch }) => {
  const [recent, trending, popular] = await Promise.all([
    recentEpisodes.get(null) ?? fetchRecentEpisodes(fetch),
    trendingAnimes.get(null) ?? fetchTrendingAnime(fetch),
    popularAnimes.get(null) ?? fetchPopularAnime(fetch)
  ]);

  return {
    recent: recent,
    trending: trending,
    popular: popular
  };
}) satisfies PageLoad;
