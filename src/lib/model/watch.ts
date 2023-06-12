import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, Episode } from './classes/Anime';

let store: Store | undefined = undefined;

export type WatchType = {
  episode: Episode;
  time: number;
  percentage: number;
};
type WatchingAnime = Anime & {
  watchEpisode: Episode;
  watchTime: number;
  watchedEpisodes: { [episodeId: string]: WatchType };
};

function createWatching() {
  const dict: { [animeId: string]: WatchingAnime } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  function add(anime: Anime, episode: Episode) {
    update(subscriptions => {
      if (subscriptions[anime.id]) {
        subscriptions[anime.id].watchEpisode = episode;
        subscriptions[anime.id].watchTime = Date.now();
      } else {
        subscriptions[anime.id] = {
          ...anime,
          watchEpisode: episode,
          watchTime: Date.now(),
          watchedEpisodes: {
            [episode.id]: {
              episode,
              time: 0,
              percentage: 0
            }
          }
        };
      }
      store?.set('watching', subscriptions);
      return subscriptions;
    });
  }
  return {
    subscribe,
    set: (subscriptions: typeof dict) => {
      set(subscriptions);
      store?.set('watching', subscriptions);
    },
    add,
    watch: (anime: Anime, data: WatchType) => {
      update(subscriptions => {
        if (!subscriptions[anime.id]) {
          add(anime, data.episode);
        }
        subscriptions[anime.id].watchedEpisodes[data.episode.id] = data;
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    remove: (animeId: string) => {
      update(subscriptions => {
        delete subscriptions[animeId];
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    removeEpisode: (animeId: string, episodeId: string) => {
      update(subscriptions => {
        delete subscriptions[animeId]?.watchedEpisodes[episodeId];
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
