import {
  carouselPage,
  popularAnimes,
  recentEpisodes,
  trendingAnimes
} from '$lib/model/cache';
import type { Anime, RecentAnime } from '$lib/model/classes/Anime';

const timeout = 15_000;

export async function fetchRecentEpisodes(
  _fetch: typeof fetch,
  settings?: { page: number; perPage: number }
) {
  const recent = (
    await _fetch(
      `https://consumet.app.jet-black.xyz/meta/anilist/recent-episodes?page=${
        settings?.page ?? 1
      }&perPage=${settings?.perPage ?? 25}`,
      { signal: AbortSignal.timeout(timeout) }
    ).then(r => r.json())
  ).results as RecentAnime[];
  const animes = [...(recentEpisodes.get(0) ?? []), ...recent].filter(
    (anime, index, self) =>
      index ===
      self.findIndex(
        ({ id, episodeNumber }) =>
          `${id}/${episodeNumber}` === `${anime.id}/${anime.episodeNumber}`
      )
  );
  recentEpisodes.set(0, animes);
  return recent;
}

export async function fetchTrendingAnime(
  _fetch: typeof fetch,
  settings?: { page: number; perPage: number }
) {
  const trending = (
    await _fetch(
      `https://consumet.app.jet-black.xyz/meta/anilist/trending?page=${
        settings?.page ?? 1
      }&perPage=${settings?.perPage ?? 25}`,
      {
        signal: AbortSignal.timeout(timeout)
      }
    ).then(r => r.json())
  ).results as Anime[];
  const animes = [...(trendingAnimes.get(0) ?? []), ...trending].filter(
    (anime, index, self) =>
      index === self.findIndex(({ id }) => id === anime.id)
  );
  trendingAnimes.set(0, animes);
  carouselPage.set(0);
  return trending;
}

export async function fetchPopularAnime(
  _fetch: typeof fetch,
  settings?: { page: number; perPage: number }
) {
  const popular = (
    await _fetch(
      `https://consumet.app.jet-black.xyz/meta/anilist/popular?page=${
        settings?.page ?? 1
      }&perPage=${settings?.perPage ?? 25}`,
      {
        signal: AbortSignal.timeout(timeout)
      }
    ).then(r => r.json())
  ).results as Anime[];
  const animes = [...(popularAnimes.get(0) ?? []), ...popular].filter(
    (anime, index, self) =>
      index === self.findIndex(({ id }) => id === anime.id)
  );
  popularAnimes.set(0, animes);
  return popular;
}
