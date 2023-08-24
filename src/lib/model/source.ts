import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { ResponseType } from '@tauri-apps/api/http';
import { LRUCache } from 'lru-cache';
import { get, writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import { searchCache } from './cache';
import type { Anime, Episode, RecentAnime } from './classes/Anime';
import { notifications } from './notifications';

/**
 * IDK why but for some reason only this store breaks building, maybe because of settings?
 */
let store: Store | undefined = undefined;

export type Provider = {
  name: string;
  id: string;
  url: string;
  updateUrl: string;
  logo: string;
  description: string;
  scripts: {
    search: string;
    fetchTrendingAnime: string;
    fetchPopularAnime: string;
    fetchAnimeInfo: string;
    fetchRecentEpisodes: string;
    fetchAiringSchedule: string;
    fetchEpisodes: string;
  };
  shareLinks?: {
    anime?: string;
    episode?: string;
  };
  externalLinks?: [string, string][];
  languages: string[];
  tags: string[];
  status: 'working' | 'broken' | 'unknown';
  isNSFW: boolean;
  version: string;
};

export const defaultProviders: { [key: string]: Provider } = {
  gogoanime: {
    name: 'Gogoanime',
    id: 'gogoanime',
    url: 'https://gogoanimehd.to/',
    updateUrl: '',
    logo: 'https://play-lh.googleusercontent.com/MaGEiAEhNHAJXcXKzqTNgxqRmhuKB1rCUgb15UrN_mWUNRnLpO5T1qja64oRasO7mn0',
    description:
      'Watch anime online in high quality for free with English subbed, dubbed. Update daily, No tracking, No paying, No registration required.',
    scripts: {
      search: (async (query: string, page = 1, perPage = 25) => {
        const url = new URL(`https://api.consumet.org/meta/anilist/${query}`);
        url.searchParams.set('page', String(page));
        url.searchParams.set('perPage', String(perPage));

        const results = (await fetch(url).then(r => r.json()))
          .results as Anime[];
        return results;
      }).toString(),
      fetchTrendingAnime: (async (page = 1, perPage = 25) => {
        const trending = (
          await fetch(
            `https://api.consumet.org/meta/anilist/trending?page=${page}&perPage=${perPage}`
          ).then(r => r.json())
        ).results as Anime[];
        return trending;
      }).toString(),
      fetchPopularAnime: (async (page = 1, perPage = 25) => {
        const popular = (
          await fetch(
            `https://api.consumet.org/meta/anilist/popular?page=${page}&perPage=${perPage}`
          ).then(r => r.json())
        ).results as Anime[];
        return popular;
      }).toString(),
      fetchRecentEpisodes: (async (page = 1, perPage = 25) => {
        const recent = (
          await fetch(
            `https://api.consumet.org/meta/anilist/recent-episodes?page=${page}&perPage=${perPage}`
          ).then(r => r.json())
        ).results as RecentAnime[];
        return recent;
      }).toString(),
      fetchAiringSchedule: '',
      fetchAnimeInfo: (async (
        id: string,
        isSub: boolean,
        isFiller: boolean
      ) => {
        const url = new URL(`https://api.consumet.org/meta/anilist/info/${id}`);
        url.searchParams.set('provider', 'gogoanime');
        url.searchParams.set('dub', String(!isSub));
        url.searchParams.set('fetchFiller', String(isFiller));
        const res = await fetch(url.toString());
        const anime: Anime = await res.json();
        return {
          ...anime,
          episodes: anime.episodes.sort((a, b) => a.number - b.number)
        };
      }).toString(),
      fetchEpisodes: (async (id: string) => {
        const res = await fetch(
          `https://api.consumet.org/meta/anilist/watch/${id}?provider=gogoanime`
        );
        const anime: Anime = await res.json();
        return anime;
      }).toString()
    },
    shareLinks: {
      anime: 'https://anilist.co/anime/{id}',
      episode: 'https://gogoanimehd.to/{episode}'
    },
    externalLinks: [
      ['Website', 'https://gogoanimehd.to/'],
      ['Discord', 'https://discord.com/invite/gogo'],
      ['Reddit', 'https://www.reddit.com/r/AroundAnimeTV/'],
      ['Twitter', 'https://twitter.com/anime_around'],
      ['Facebook', 'https://www.facebook.com/groups/409309663623039'],
      ['Telegram', 'https://t.me/joinchat/W4lYQ-RGOQ05MmI9']
    ],
    languages: ['english'],
    tags: ['anime', 'dubbed', 'subbed', 'gogoanime'],
    status: 'working',
    isNSFW: false,
    version: '1.0.0'
  },
  zoro: {
    name: 'Zoro',
    id: 'zoro',
    url: 'https://zoro.to/',
    updateUrl: '',
    logo: 'https://is3-ssl.mzstatic.com/image/thumb/Purple112/v4/7e/91/00/7e9100ee-2b62-0942-4cdc-e9b93252ce1c/source/512x512bb.jpg',
    description:
      'Watch anime online in high quality for free with English subbed, dubbed. Update daily, No tracking, No paying, No registration required.',
    scripts: {
      search: (async (query: string, page = 1, perPage = 25) => {
        const url = new URL(`https://api.consumet.org/meta/anilist/${query}`);
        url.searchParams.set('page', String(page));
        url.searchParams.set('perPage', String(perPage));

        const results = (await fetch(url).then(r => r.json()))
          .results as Anime[];
        return results;
      }).toString(),
      fetchTrendingAnime: (async (page = 1, perPage = 25) => {
        const trending = (
          await fetch(
            `https://api.consumet.org/meta/anilist/trending?page=${page}&perPage=${perPage}`
          ).then(r => r.json())
        ).results as Anime[];
        return trending;
      }).toString(),
      fetchPopularAnime: (async (page = 1, perPage = 25) => {
        const popular = (
          await fetch(
            `https://api.consumet.org/meta/anilist/popular?page=${page}&perPage=${perPage}`
          ).then(r => r.json())
        ).results as Anime[];
        return popular;
      }).toString(),
      fetchRecentEpisodes: (async (page = 1, perPage = 25) => {
        const recent = (
          await fetch(
            `https://api.consumet.org/meta/anilist/recent-episodes?page=${page}&perPage=${perPage}`
          ).then(r => r.json())
        ).results as RecentAnime[];
        return recent;
      }).toString(),
      fetchAiringSchedule: '',
      fetchAnimeInfo: (async (
        id: string,
        isSub: boolean,
        isFiller: boolean
      ) => {
        const url = new URL(`https://api.consumet.org/meta/anilist/info/${id}`);
        url.searchParams.set('provider', 'zoro');
        url.searchParams.set('dub', String(!isSub));
        url.searchParams.set('fetchFiller', String(isFiller));
        const res = await fetch(url.toString());
        const anime: Anime = await res.json();
        return {
          ...anime,
          episodes: anime.episodes.sort((a, b) => a.number - b.number)
        };
      }).toString(),
      fetchEpisodes: (async (id: string) => {
        const res = await fetch(
          `https://api.consumet.org/meta/anilist/watch/${id}?provider=zoro`
        );
        const anime: Anime = await res.json();
        return anime;
      }).toString()
    },
    shareLinks: {
      anime: 'https://anilist.co/anime/{id}'
    },
    languages: ['english'],
    tags: ['anime', 'dubbed', 'subbed', 'zoro'],
    status: 'broken',
    isNSFW: false,
    version: '1.0.0'
  }
};

// Prevent modification of default providers
Object.freeze(defaultProviders);

function createSource() {
  const { subscribe, set } = writable<Provider>(defaultProviders.gogoanime);
  return {
    subscribe,
    set: async (source: Provider) => {
      set(source);
      await store?.set('source', source);
    },
    initialize: async () => {
      try {
        const StoreImport = (await import('tauri-plugin-store-api')).Store;
        store ??= new StoreImport('.settings.dat');
        const data = await store?.get<Provider>('source');
        if (data) {
          set(data);
        } else {
          await store?.set('source', defaultProviders.gogoanime);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (get(page).route.id === '/')
          goto(`/${get(source).id}/`, { replaceState: true });
      }
    }
  };
}

export const source = createSource();

function createProviders() {
  const { subscribe, set, update } = writable<typeof defaultProviders>({
    ...defaultProviders
  });
  return {
    subscribe,
    set: (providers: typeof defaultProviders) => {
      set(providers);
      searchCache.update(cache => ({
        ...cache,
        ...Object.values(providers).reduce(
          (a, v) => ({
            ...a,
            [v.id]: new LRUCache<string, Anime[]>({
              max: 100,
              ttl: 1000 * 60 * 30
            })
          }),
          {}
        )
      }));
      store?.set('providers', providers);
    },
    add: (provider: Provider) => {
      update(providers => {
        providers[provider.id] = provider;
        searchCache.update(cache => ({
          ...cache,
          [provider.id]: new LRUCache<string, Anime[]>({
            max: 100,
            ttl: 1000 * 60 * 30
          })
        }));
        store?.set('providers', providers);
        return providers;
      });
    },
    remove(provider: Provider) {
      update(providers => {
        delete providers[provider.id];
        if (get(source).id === provider.id) {
          source.set(defaultProviders.gogoanime);
        }
        store?.set('providers', providers);
        return providers;
      });
    },
    clear() {
      set({ ...defaultProviders });
      source.set(defaultProviders.gogoanime);
      searchCache.update(cache => ({
        ...cache,
        ...Object.values(defaultProviders).reduce(
          (a, v) => ({
            ...a,
            [v.id]: new LRUCache<string, Anime[]>({
              max: 100,
              ttl: 1000 * 60 * 30
            })
          }),
          {}
        )
      }));
      store?.set('providers', defaultProviders);
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.settings.dat');
      const data = await store.get<typeof defaultProviders>('providers');
      if (data) {
        const providers = {
          ...(data ?? {}),
          ...(defaultProviders ?? {})
        };
        console.debug('Providers', providers);
        set(providers);
        searchCache.update(cache => ({
          ...cache,
          ...Object.values(providers).reduce(
            (a, v) => ({
              ...a,
              [v.id]: new LRUCache<string, Anime[]>({
                max: 100,
                ttl: 1000 * 60 * 30
              })
            }),
            {}
          )
        }));
      } else {
        await store.set('providers', defaultProviders);
      }
    }
  };
}

export const providers = createProviders();

export function isProvider(source: unknown): boolean {
  if (!source) {
    console.error('Source is null');
    return false;
  }

  if (typeof source !== 'object') {
    console.error('Source is not an object');
    return false;
  }

  try {
    Object.entries(defaultProviders.gogoanime).forEach(([key, value]) => {
      if (
        !(key in source) ||
        typeof source[key as keyof typeof source] !== typeof value
      ) {
        console.error(
          'Incorrect key',
          key,
          value,
          source[key as keyof typeof source]
        );
        throw new Error(`Incorrect key: ${key}`);
      }
    });
  } catch (e) {
    console.error(e);
    return false;
  }

  return true;
}

export function encodeAnimeLink(anime: Anime): string {
  const link = anime.source.shareLinks?.anime ?? anime.source.url;
  return link.replace('{id}', anime.id);
}

export function encodeEpisodeLink(anime: Anime, episode: Episode): string {
  const link = anime.source.shareLinks?.episode ?? anime.source.url;
  return link
    .replaceAll('{id}', anime.id)
    .replaceAll('{episode}', episode.id)
    .replaceAll('{number}', String(episode.number));
}

export async function checkUpdate(source: Provider) {
  try {
    if (!source.updateUrl) throw new Error('No update url');

    const { fetch } = await import('@tauri-apps/api/http');

    const response = await fetch<string>(source.updateUrl, {
      method: 'GET',
      timeout: 15,
      responseType: ResponseType.Text
    });

    if (response.status !== 200) throw new Error('Invalid response');

    const data: Provider = await JSON.parse(response.data);

    if (isProvider(data))
      providers.add({
        ...source,
        ...data,
        id: source.id
      });
    else throw new Error('Invalid scheme');
  } catch (e) {
    notifications.addNotification({
      title: 'Update Error',
      message: `Failed to update ${source.name}: ${e}`,
      type: 'error'
    });
  }
}
