import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';

/**
 * IDK why but for some reason only this store breaks building, maybe because of settings?
 * Prbly will replace this with consumet anyways
 */

const store = new Store('.settings.dat');

export type Provider = {
  name: string;
  id: string;
  logo: string;
  isNSFW: boolean;
};

export const defaultProviders: Provider[] = [
  {
    name: 'Gogoanime',
    id: 'gogoanime',
    logo: 'https://play-lh.googleusercontent.com/MaGEiAEhNHAJXcXKzqTNgxqRmhuKB1rCUgb15UrN_mWUNRnLpO5T1qja64oRasO7mn0',
    isNSFW: false
  },
  {
    name: 'Zoro',
    id: 'zoro',
    logo: 'https://is3-ssl.mzstatic.com/image/thumb/Purple112/v4/7e/91/00/7e9100ee-2b62-0942-4cdc-e9b93252ce1c/source/512x512bb.jpg',
    isNSFW: false
  }
];

function createSource() {
  const { subscribe, set } = writable<Provider>(defaultProviders[0]);
  return {
    subscribe,
    set: async (source: Provider) => {
      set(source);
      await store.set('source', source);
    },
    initialize: async () => {
      const data = await store.get<Provider>('source');
      if (data) {
        set(data);
      } else {
        await store.set('source', defaultProviders[0]);
      }
    }
  };
}

export const source = createSource();

function createProviders() {
  const { subscribe, set, update } = writable<Provider[]>(defaultProviders);
  return {
    subscribe,
    set: async (providers: Provider[]) => {
      set(providers);
      await store.set('providers', providers);
    },
    add: (provider: Provider) => {
      update(providers => {
        const result = [
          provider,
          ...providers.filter(i => i.id !== provider.id)
        ];
        store.set('providers', result);
        return result;
      });
    },
    remove(provider: Provider) {
      update(providers => {
        const result = providers.filter(i => i.id !== provider.id);
        store.set('providers', result);
        return result;
      });
    },
    initialize: async () => {
      const data = await store.get<Provider[]>('providers');
      if (data) {
        set(data);
      } else {
        await store.set('providers', defaultProviders[0]);
      }
    }
  };
}

export const providers = createProviders();
