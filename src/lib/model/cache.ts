import { LRUCache } from 'lru-cache';
import { writable } from 'svelte/store';
import type { Anime, EpisodeData, RecentAnime } from './classes/Anime';
import type { Provider } from './source';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

export const animeCache = new LRUCache<string, Anime>({
  max: 100,
  ttl: HOUR
});

export const episodeCache = new LRUCache<string, EpisodeData>({
  max: 100,
  ttl: MINUTE * 30
});

export const recentEpisodes = new LRUCache<
  string,
  (Pick<
    RecentAnime,
    'id' | 'image' | 'title' | 'episodeNumber' | 'color' | 'isAdult' | 'source'
  > &
    Partial<RecentAnime> & {
      source: Pick<Provider, 'id' | 'name' | 'url' | 'shareLinks'> &
        Partial<Provider>;
    })[]
>({
  max: 50,
  ttl: MINUTE * 15
});

export const trendingAnimes = new LRUCache<
  string,
  (Pick<
    Anime,
    | 'id'
    | 'image'
    | 'title'
    | 'description'
    | 'cover'
    | 'color'
    | 'isAdult'
    | 'source'
  > &
    Partial<Anime> & {
      source: Pick<Provider, 'id' | 'name' | 'url' | 'shareLinks'> &
        Partial<Provider>;
    })[]
>({
  max: 50,
  ttl: MINUTE * 15
});

export const popularAnimes = new LRUCache<
  string,
  (Pick<Anime, 'id' | 'image' | 'title' | 'color' | 'isAdult'> &
    Partial<Anime> & {
      source: Pick<Provider, 'id' | 'name' | 'url' | 'shareLinks'> &
        Partial<Provider>;
    })[]
>({
  max: 50,
  ttl: HOUR * 24
});

export const scrollYCache = new LRUCache<string, number>({
  max: 100,
  ttl: HOUR
});

export const scrollY = writable<number>(0);

const carouselDict: {
  [key: string]: number;
} = {};
export const carouselPage = writable<typeof carouselDict>(carouselDict);

const searchDict: {
  [key: string]: LRUCache<string, Anime[]>;
} = {};
export const searchCache = writable<typeof searchDict>(searchDict);

export function clearCache() {
  recentEpisodes.clear();
  trendingAnimes.clear();
  popularAnimes.clear();
  animeCache.clear();
  episodeCache.clear();
  carouselPage.set(carouselDict);
  searchCache.set(searchDict);
  scrollYCache.clear();
  localStorage?.clear();
}
