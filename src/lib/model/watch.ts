import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, Episode } from './Anime';

let store: Store | undefined = undefined;

function createWatching() {
  const { subscribe, set, update } = writable<
    { anime: Anime; episode: number }[]
  >([]);
  return {
    subscribe,
    set: (subscriptions: { anime: Anime; episode: number }[]) => {
      set(subscriptions);
      store?.set('watching', subscriptions);
    },
    add: (anime: Anime, episode: number) => {
      update(subscriptions => {
        const result = [
          { anime, episode },
          ...subscriptions.filter(({ anime: { id } }) => id !== anime.id)
        ].slice(0, 10);
        store?.set('watching', result);
        return result;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        const result = subscriptions.filter(
          ({ anime: { id } }) => id !== anime.id
        );
        store?.set('watching', result);
        return result;
      });
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.subscriptions.dat');
      const data = await store.get<{ anime: Anime; episode: number }[]>(
        'watching'
      );
      if (data) {
        set(data);
      } else {
        await store.set('watching', []);
      }
    }
  };
}

export const watching = createWatching();

export type WatchType = {
  episode: Episode;
  time: number;
  percentage: number;
};

function createWatched() {
  const dict: { [key: string]: WatchType[] } = {};
  const { subscribe, set, update } = writable(dict);
  return {
    subscribe,
    set: (map: { [key: string]: WatchType[] }) => {
      set(map);
      store?.set('watched', map);
    },
    add: (key: string, data: WatchType) => {
      update(map => {
        const temp = [
          ...(map[key] ?? []).filter(
            ({ episode: { id } }) => id !== data.episode.id
          ),
          data
        ];
        temp.sort((a, b) => a.episode.number - b.episode.number);
        map[key] = temp;
        store?.set('watched', map);
        return map;
      });
    },
    remove: (key: string) => {
      update(map => {
        delete map[key];
        store?.set('watched', map);
        return map;
      });
    },
    clear: () => {
      set({});
      store?.set('watched', {});
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.subscriptions.dat');
      const data = await store.get<{ [key: string]: WatchType[] }>('watched');
      if (data) {
        set({});
      } else {
        await store.set('watched', {});
      }
    }
  };
}

export const watched = createWatched();
