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
      if (subscriptions[`${anime.source.id}/${anime.id}`]) {
        subscriptions[`${anime.source.id}/${anime.id}`].watchEpisode = episode;
        subscriptions[`${anime.source.id}/${anime.id}`].watchTime = Date.now();
      } else {
        subscriptions[`${anime.source.id}/${anime.id}`] = {
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
        if (!subscriptions[`${anime.source.id}/${anime.id}`]) {
          add(anime, data.episode);
        }
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          ...subscriptions[`${anime.source.id}/${anime.id}`],
          ...anime,
          watchedEpisodes: {
            ...subscriptions[`${anime.source.id}/${anime.id}`].watchedEpisodes,
            [data.episode.id]: data
          },
          watchEpisode: data.episode,
          watchTime: Date.now()
        };
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    watchAll(anime: Anime, episodes: Episode[]) {
      update(subscriptions => {
        if (!subscriptions[`${anime.source.id}/${anime.id}`]) {
          add(anime, episodes[0]);
        }
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          ...subscriptions[`${anime.source.id}/${anime.id}`],
          ...anime
        };
        const data =
          subscriptions[`${anime.source.id}/${anime.id}`].watchedEpisodes;
        episodes.forEach(episode => {
          data[episode.id] = {
            episode,
            time: 0,
            percentage: 1
          };
        });
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    updateAnime: (anime: Anime) => {
      update(subscriptions => {
        if (!subscriptions[`${anime.source.id}/${anime.id}`]) {
          add(anime, anime.episodes[0]);
        } else {
          subscriptions[`${anime.source.id}/${anime.id}`] = {
            ...subscriptions[`${anime.source.id}/${anime.id}`],
            ...anime
          };
        }
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        delete subscriptions[`${anime.source.id}/${anime.id}`];
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    removeEpisode: (anime: Anime, episodeId: string) => {
      update(subscriptions => {
        delete subscriptions[`${anime.source.id}/${anime.id}`]?.watchedEpisodes[
          episodeId
        ];
        if (
          Object.entries(
            subscriptions[`${anime.source.id}/${anime.id}`]?.watchedEpisodes ??
              {}
          ).length === 0
        ) {
          delete subscriptions[`${anime.source.id}/${anime.id}`];
        }
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
