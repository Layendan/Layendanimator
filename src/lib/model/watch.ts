import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, Episode } from './classes/Anime';

let store: Store | undefined = undefined;

type WatchingAnime = Anime & { watchEpisode: number; watchTime: number };

function createWatching() {
  const dict: { [key: string]: WatchingAnime } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  return {
    subscribe,
    set: (subscriptions: typeof dict) => {
      set(subscriptions);
      store?.set('watching', subscriptions);
    },
    add: (anime: Anime, episode: number) => {
      update(subscriptions => {
        if (subscriptions[anime.id]) {
          subscriptions[anime.id].watchEpisode = episode;
          subscriptions[anime.id].watchTime = Date.now();
        } else {
          subscriptions[anime.id] = {
            ...anime,
            watchEpisode: episode,
            watchTime: Date.now()
          };
        }
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        delete subscriptions[anime.id];
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    clear: () => {
      set({});
      store?.set('watching', {});
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.subscriptions.dat');
      const data = await store.get<typeof dict>('watching');
      if (data) {
        set(data);
      } else {
        await store.set('watching', {});
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
  const dict: { [animeId: string]: WatchType[] } = {};
  const { subscribe, set, update } = writable(dict);
  return {
    subscribe,
    set: (map: typeof dict) => {
      set(map);
      store?.set('watched', map);
    },
    add: (animeId: string, data: WatchType) => {
      update(map => {
        const temp = [
          ...(map[animeId] ?? []).filter(
            ({ episode: { id } }) => id !== data.episode.id
          ),
          data
        ];
        temp.sort((a, b) => a.episode.number - b.episode.number);
        map[animeId] = temp;
        store?.set('watched', map);
        store?.save();
        return map;
      });
    },
    removeAnime: (animeId: string) => {
      update(map => {
        delete map[animeId];
        store?.set('watched', map);
        return map;
      });
    },
    removeEpisode: (animeId: string, episodeId: string) => {
      update(map => {
        map[animeId] = (map[animeId] ?? []).filter(
          ({ episode: { id } }) => id !== episodeId
        );
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
      const data = await store.get<typeof dict>('watched');
      if (data) {
        set(data);
      } else {
        await store.set('watched', {});
      }
    }
  };
}

export const watched = createWatched();
