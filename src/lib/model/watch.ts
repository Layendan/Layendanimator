import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, Episode } from './classes/Anime';

let store: Store | undefined = undefined;

export type WatchType = {
  episode: Pick<Episode, 'id' | 'title' | 'number'>;
  time: number;
  percentage: number;
};
type WatchingAnime = Pick<
  Anime,
  'id' | 'title' | 'image' | 'color' | 'source'
> & {
  watchEpisode: Pick<Episode, 'id' | 'number'>;
  watchTime: number;
  watchedEpisodes: { [episodeId: string]: WatchType };
};

function createWatching() {
  const dict: { [animeId: string]: WatchingAnime } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  function add(anime: Anime, episode: WatchType['episode']) {
    update(subscriptions => {
      if (subscriptions[`${anime.source.id}/${anime.id}`]) {
        subscriptions[`${anime.source.id}/${anime.id}`].watchEpisode = {
          id: episode.id,
          number: episode.number
        };
        subscriptions[`${anime.source.id}/${anime.id}`].watchTime = Date.now();
      } else {
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          },
          watchEpisode: {
            id: episode.id,
            number: episode.number
          },
          watchTime: Date.now(),
          watchedEpisodes: {
            [episode.id]: {
              episode: {
                id: episode.id,
                title: episode.title,
                number: episode.number
              },
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
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          },
          watchedEpisodes: {
            ...subscriptions[`${anime.source.id}/${anime.id}`].watchedEpisodes,
            [data.episode.id]: data
          },
          watchEpisode: {
            id: data.episode.id,
            number: data.episode.number
          },
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
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          }
        };
        const data =
          subscriptions[`${anime.source.id}/${anime.id}`].watchedEpisodes;
        episodes.forEach(episode => {
          data[episode.id] = {
            episode: {
              id: episode.id,
              title: episode.title,
              number: episode.number
            },
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
            id: anime.id,
            title: anime.title,
            image: anime.image,
            color: anime.color,
            source: {
              id: anime.source.id,
              name: anime.source.name,
              url: anime.source.url,
              shareLinks: anime.source.shareLinks
            }
          };
        }
        store?.set('watching', subscriptions);
        return subscriptions;
      });
    },
    remove: (anime: Pick<Anime, 'id' | 'source'>) => {
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
        set(
          Object.entries(data).reduce<typeof dict>((acc, [key, value]) => {
            acc[key] = {
              id: value.id,
              title: value.title,
              image: value.image,
              color: value.color,
              source: {
                id: value.source.id,
                name: value.source.name,
                url: value.source.url,
                shareLinks: value.source.shareLinks
              },
              watchEpisode: {
                id: value.watchEpisode.id,
                number: value.watchEpisode.number
              },
              watchTime: value.watchTime,
              watchedEpisodes: Object.entries(value.watchedEpisodes).reduce<
                WatchingAnime['watchedEpisodes']
              >((acc, [key, value]) => {
                acc[key] = {
                  episode: {
                    id: value.episode.id,
                    title: value.episode.title,
                    number: value.episode.number
                  },
                  time: value.time,
                  percentage: value.percentage
                };
                return acc;
              }, {})
            };
            return acc;
          }, {})
        );
      } else {
        await store.set('watching', {});
      }
    }
  };
}

export const watching = createWatching();
