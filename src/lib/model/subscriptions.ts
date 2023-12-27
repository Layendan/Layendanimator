import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import { animeCache } from './cache';
import type { Anime } from './classes/Anime';
import { notifications } from './notifications';

let store: Store | undefined = undefined;

export type Subscription = Pick<Anime, 'id' | 'title' | 'image' | 'source'> &
  Partial<Anime> & { lastUpdated: number; added: number };

function createSubscriptions() {
  const dict: { [key: string]: Subscription } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  return {
    subscribe,
    set: (subscriptions: typeof dict) => {
      set(subscriptions);
      store?.set('subscriptions', subscriptions);
    },
    add: (newAnime: Pick<Anime, 'id' | 'source'>) => {
      const anime =
        animeCache.get(`${newAnime.source.id}/${newAnime.id}`) ??
        (newAnime as Anime);

      update(subscriptions => {
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          isAdult: anime.isAdult,
          episodes: anime.episodes,
          nextAiringEpisode: anime.nextAiringEpisode,
          status: anime.status,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          },
          lastUpdated: Date.now(),
          added: Date.now()
        };
        store?.set('subscriptions', subscriptions);
        store?.save();
        return subscriptions;
      });
    },
    updateDate: (anime: Anime) => {
      update(subscriptions => {
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          ...subscriptions[`${anime.source.id}/${anime.id}`],
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          isAdult: anime.isAdult,
          episodes: anime.episodes,
          nextAiringEpisode: anime.nextAiringEpisode,
          status: anime.status,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          },
          lastUpdated: Date.now()
        };
        store?.set('subscriptions', subscriptions);
        return subscriptions;
      });
    },
    remove: (anime: Pick<Anime, 'id' | 'source'>) => {
      update(subscriptions => {
        delete subscriptions[`${anime.source.id}/${anime.id}`];
        store?.set('subscriptions', subscriptions);
        return subscriptions;
      });
    },
    clear: () => {
      set({});
      store?.set('subscriptions', {});
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.subscriptions.dat');
      const data = await store.get<typeof dict>('subscriptions');
      if (data) {
        set(
          Object.entries(data).reduce<typeof dict>((acc, [key, value]) => {
            acc[key] = {
              id: value.id,
              title: value.title,
              image: value.image,
              color: value.color,
              isAdult: value.isAdult,
              episodes: value.episodes,
              nextAiringEpisode: value.nextAiringEpisode,
              status: value.status,
              source: {
                id: value.source.id,
                name: value.source.name,
                url: value.source.url,
                shareLinks: value.source.shareLinks
              },
              lastUpdated: value.lastUpdated,
              added: value.added
            };
            return acc;
          }, {})
        );
      } else {
        await store.set('subscriptions', {});
      }
    }
  };
}

export const subscriptions = createSubscriptions();

async function sendNotification(title: string, body: string) {
  const { isPermissionGranted, requestPermission, sendNotification } =
    await import('@tauri-apps/api/notification');
  if (await isPermissionGranted()) {
    sendNotification({
      title,
      body
    });
  } else if ((await requestPermission()) === 'granted') {
    sendNotification({
      title,
      body
    });
  } else {
    console.error('Permission not granted');
    notifications.addNotification({
      title: 'Permission not granted',
      message: 'Please enable notifications to receive download notifications',
      type: 'error'
    });
  }
}

export type UnwatchedSubscriptions = Subscription & {
  newEpisodes: Set<string>;
};

function createUnwatchedSubscriptions() {
  const dict: { [key: string]: UnwatchedSubscriptions } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  return {
    subscribe,
    set: (subscriptions: typeof dict) => {
      set(subscriptions);
      store?.set('activeSubscriptions', subscriptions);
    },
    add: (newAnime: Pick<Anime, 'id' | 'source'>, newEpisodesId: string[]) => {
      const anime =
        animeCache.get(`${newAnime.source.id}/${newAnime.id}`) ??
        (newAnime as Anime);

      update(subscriptions => {
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          isAdult: anime.isAdult,
          episodes: anime.episodes,
          nextAiringEpisode: anime.nextAiringEpisode,
          status: anime.status,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          },
          lastUpdated: Date.now(),
          added: Date.now(),
          newEpisodes: new Set<string>(newEpisodesId)
        };
        store?.set(
          'activeSubscriptions',
          convertUnwatchedSubscriptions(subscriptions)
        );
        store?.save();

        const animeTitle = anime.title.english ?? anime.title.native;
        const message =
          newEpisodesId.length === 1
            ? `There is 1 new episode for ${animeTitle}`
            : `There are ${newEpisodesId.length} new episodes for ${animeTitle}`;
        const title = `New Episodes for ${animeTitle}`;

        notifications.addNotification({
          title,
          message
        });
        sendNotification(title, message);
        return subscriptions;
      });
    },
    updateDate: (anime: Anime) => {
      update(subscriptions => {
        subscriptions[`${anime.source.id}/${anime.id}`] = {
          ...subscriptions[`${anime.source.id}/${anime.id}`],
          id: anime.id,
          title: anime.title,
          image: anime.image,
          color: anime.color,
          isAdult: anime.isAdult,
          episodes: anime.episodes,
          nextAiringEpisode: anime.nextAiringEpisode,
          status: anime.status,
          source: {
            id: anime.source.id,
            name: anime.source.name,
            url: anime.source.url,
            shareLinks: anime.source.shareLinks
          },
          lastUpdated: Date.now()
        };
        store?.set(
          'activeSubscriptions',
          convertUnwatchedSubscriptions(subscriptions)
        );
        return subscriptions;
      });
    },
    update,
    remove: (anime: Pick<Anime, 'id' | 'source'>) => {
      update(subscriptions => {
        delete subscriptions[`${anime.source.id}/${anime.id}`];
        store?.set(
          'activeSubscriptions',
          convertUnwatchedSubscriptions(subscriptions)
        );
        return subscriptions;
      });
    },
    clear: () => {
      set({});
      store?.set('activeSubscriptions', {});
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.subscriptions.dat');
      const data = await store.get<typeof dict>('activeSubscriptions');
      if (data) {
        const newSubscriptions = Object.entries(data).reduce<typeof dict>(
          (acc, [key, value]) => {
            acc[key] = {
              id: value.id,
              title: value.title,
              image: value.image,
              color: value.color,
              isAdult: value.isAdult,
              episodes: value.episodes,
              nextAiringEpisode: value.nextAiringEpisode,
              status: value.status,
              source: {
                id: value.source.id,
                name: value.source.name,
                url: value.source.url,
                shareLinks: value.source.shareLinks
              },
              lastUpdated: value.lastUpdated,
              added: value.added,
              newEpisodes: new Set(
                typeof value.newEpisodes === 'number'
                  ? value.episodes
                      ?.slice(-value.newEpisodes)
                      .map(({ id }) => id) ?? []
                  : Array.from(value.newEpisodes)
              )
            };
            return acc;
          },
          {}
        );
        set(newSubscriptions);
      } else {
        await store.set('activeSubscriptions', {});
      }
    }
  };
}

export const unwatchedSubscriptions = createUnwatchedSubscriptions();

function convertUnwatchedSubscriptions(subscriptions: {
  [key: string]: UnwatchedSubscriptions;
}) {
  // Go through each item in the subscriptions object and convert newEpisodes from Set to Array
  const newSubscriptions = Object.entries(subscriptions).reduce<{
    [key: string]: Subscription & {
      newEpisodes: string[];
    };
  }>((acc, [key, value]) => {
    acc[key] = {
      ...value,
      newEpisodes: Array.from(value.newEpisodes)
    };
    return acc;
  }, {});

  return newSubscriptions;
}
