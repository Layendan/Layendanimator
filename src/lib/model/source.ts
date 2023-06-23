import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';

/**
 * IDK why but for some reason only this store breaks building, maybe because of settings?
 */
let store: Store | undefined = undefined;

export type Provider = {
  name: string;
  id: string;
  path: string;
  logo: string;
  scripts: {
    search: string;
    fetchTrendingAnime: string;
    fetchPopularAnime: string;
    fetchAnimeInfo: string;
    fetchAiringSchedule: string;
    fetchEpisodeSources: string;
  };
  languages: string[];
  status: 'working' | 'broken' | 'unknown';
  isNSFW: boolean;
};

export const defaultProviders: { [key: string]: Provider } = {
  gogoanime: {
    name: 'Gogoanime',
    id: 'gogoanime',
    path: '/sources/gogoanime.js',
    logo: 'https://play-lh.googleusercontent.com/MaGEiAEhNHAJXcXKzqTNgxqRmhuKB1rCUgb15UrN_mWUNRnLpO5T1qja64oRasO7mn0',
    scripts: {
      search: '',
      fetchTrendingAnime: '',
      fetchPopularAnime: '',
      fetchAnimeInfo: '',
      fetchAiringSchedule: '',
      fetchEpisodeSources: ''
    },
    languages: ['en'],
    status: 'working',
    isNSFW: false
  },
  zoro: {
    name: 'Zoro',
    id: 'zoro',
    path: '/sources/zoro.js',
    logo: 'https://is3-ssl.mzstatic.com/image/thumb/Purple112/v4/7e/91/00/7e9100ee-2b62-0942-4cdc-e9b93252ce1c/source/512x512bb.jpg',
    scripts: {
      search: '',
      fetchTrendingAnime: '',
      fetchPopularAnime: '',
      fetchAnimeInfo: '',
      fetchAiringSchedule: '',
      fetchEpisodeSources: ''
    },
    languages: ['en'],
    status: 'working',
    isNSFW: false
  }
};

function createSource() {
  const { subscribe, set } = writable<Provider>(defaultProviders.gogoanime);
  return {
    subscribe,
    set: async (source: Provider) => {
      set(source);
      await store?.set('source', source);
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.settings.dat');
      const data = await store?.get<Provider>('source');
      if (data) {
        set(data);
      } else {
        await store?.set('source', defaultProviders.gogoanime);
      }
    }
  };
}

export const source = createSource();

function createProviders() {
  const { subscribe, set, update } =
    writable<typeof defaultProviders>(defaultProviders);
  return {
    subscribe,
    set: (providers: typeof defaultProviders) => {
      set(providers);
      store?.set('providers', providers);
    },
    add: (provider: Provider) => {
      update(providers => {
        providers[provider.id] ??= provider;
        store?.set('providers', providers);
        return providers;
      });
    },
    remove(provider: Provider) {
      update(providers => {
        delete providers[provider.id];
        store?.set('providers', providers);
        return providers;
      });
    },
    clear() {
      set(defaultProviders);
      source.set(defaultProviders.gogoanime);
      store?.set('providers', defaultProviders);
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.settings.dat');
      const data = await store.get<typeof defaultProviders>('providers');
      if (data) {
        set({
          ...defaultProviders,
          ...data
        });
      } else {
        await store.set('providers', defaultProviders);
      }
    }
  };
}

export const providers = createProviders();
