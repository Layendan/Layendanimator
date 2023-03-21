import LRUCache from 'lru-cache';
import type { Anime } from './Anime';

const MINUTE = 1000 * 60;

export const animeCache = new LRUCache<string, Anime>({
  max: 100,
  ttl: MINUTE * 60
});

export const episodeCache = new LRUCache<
  string,
  {
    download: string | undefined;
    sources: {
      url: string;
      isM3U8: boolean;
      quality: string;
    }[];
  }
>({
  max: 100,
  ttl: MINUTE * 30
});

// Only used for ttl, but didn't want to install another package
export const recentEpisodes = new LRUCache<number, Anime[]>({
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
