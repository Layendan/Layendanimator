import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification
} from '@tauri-apps/api/notification';
import type { Anime } from './Anime';

let store: Store | undefined = undefined;

function createSubscriptions() {
  const { subscribe, set, update } = writable<Anime[]>([]);
  return {
    subscribe,
    set: (subscriptions: Anime[]) => {
      set(subscriptions);
      store?.set('subscriptions', subscriptions);
    },
    add: (anime: Anime) => {
      update(subscriptions => {
        const result = [anime, ...subscriptions.filter(i => i.id !== anime.id)];
        store?.set('subscriptions', result);
        store?.save();
        return result;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        const result = subscriptions.filter(i => i.id !== anime.id);
        store?.set('subscriptions', result);
        return result;
      });
    },
    initialize: async () => {
      store ??= new Store('.subscriptions.dat');
      const data = await store.get<Anime[]>('subscriptions');
      if (data) {
        set(data);
      } else {
        await store.set('subscriptions', []);
      }
    }
  };
}

export const subscriptions = createSubscriptions();

async function sendCustomNotification(title: string, episodes: number) {
  if (await isPermissionGranted()) {
    sendNotification({
      title: `New Episodes for ${title}`,
      body:
        episodes === 1
          ? `There is 1 new episode for ${title}`
          : `There are ${episodes} new episodes for ${title}`
    });
  } else if ((await requestPermission()) === 'granted') {
    sendNotification({
      title: `New Episodes for ${title}`,
      body:
        episodes === 1
          ? `There is 1 new episode for ${title}`
          : `There are ${episodes} new episodes for ${title}`
    });
  } else {
    console.error('Permission not granted');
  }
}

function createUnwatchedSubscriptions() {
  const { subscribe, set, update } = writable<
    { anime: Anime; newEpisodes: number }[]
  >([]);
  return {
    subscribe,
    set: (subscriptions: { anime: Anime; newEpisodes: number }[]) => {
      set(subscriptions);
      store?.set('activeSubscriptions', subscriptions);
    },
    add: (anime: { anime: Anime; newEpisodes: number }) => {
      update(subscriptions => {
        const result = [
          anime,
          ...subscriptions.filter(({ anime: { id } }) => id !== anime.anime.id)
        ];
        store?.set('activeSubscriptions', result);
        store?.save();
        sendCustomNotification(
          anime.anime.title.english ?? anime.anime.title.native,
          anime.newEpisodes
        );
        return result;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        const result = subscriptions.filter(
          ({ anime: { id } }) => id !== anime.id
        );
        store?.set('activeSubscriptions', result);
        return result;
      });
    },
    initialize: async () => {
      store ??= new Store('.subscriptions.dat');
      const data = await store.get<{ anime: Anime; newEpisodes: number }[]>(
        'activeSubscriptions'
      );
      if (data) {
        set(data);
      } else {
        await store.set('activeSubscriptions', []);
      }
    }
  };
}

export const unwatchedSubscriptions = createUnwatchedSubscriptions();
