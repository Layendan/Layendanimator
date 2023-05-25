import { LRUCache } from 'lru-cache';
import { writable } from 'svelte/store';
import type { Anime, EpisodeData, RecentAnime } from './classes/Anime';

const MINUTE = 1000 * 60;

export const animeCache = new LRUCache<string, Anime>({
  max: 100,
  ttl: MINUTE * 60
});

export const episodeCache = new LRUCache<string, EpisodeData>({
  max: 100,
  ttl: MINUTE * 30
});

// Only used for ttl, but didn't want to install another package
export const recentEpisodes = new LRUCache<number, RecentAnime[]>({
  max: 1,
  ttl: MINUTE * 15
});

// Only used for ttl, but didn't want to install another package
export const trendingAnimes = new LRUCache<number, Anime[]>({
  max: 1,
  ttl: MINUTE * 30
});

// Only used for ttl, but didn't want to install another package
export const popularAnimes = new LRUCache<number, Anime[]>({
  max: 1,
  ttl: MINUTE * 60 * 24
});

export const carouselPage = writable(0);

export function clearCache() {
  recentEpisodes.clear();
  trendingAnimes.clear();
  popularAnimes.clear();
  animeCache.clear();
  episodeCache.clear();
  localStorage?.clear();
}
