import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime } from './classes/Anime';

let store: Store | undefined = undefined;

export type Subscription = Anime & { lastUpdated: number; added: number };

function createSubscriptions() {
  const dict: { [key: string]: Subscription } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  return {
    subscribe,
    set: (subscriptions: typeof dict) => {
      set(subscriptions);
      store?.set('subscriptions', subscriptions);
    },
    add: (anime: Anime) => {
      update(subscriptions => {
        subscriptions[anime.id] = {
          ...anime,
          lastUpdated: Date.now(),
          added: Date.now()
        };
        store?.set('subscriptions', subscriptions);
        store?.save();
        return subscriptions;
      });
    },
    updateDate: (id: string) => {
      update(subscriptions => {
        subscriptions[id].lastUpdated = Date.now();
        store?.set('subscriptions', subscriptions);
        return subscriptions;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        delete subscriptions[anime.id];
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
        set(data);
      } else {
        await store.set('subscriptions', {});
      }
    }
  };
}

export const subscriptions = createSubscriptions();

async function sendNotification(title: string, episodes: number) {
  const { isPermissionGranted, requestPermission, sendNotification } =
    await import('@tauri-apps/api/notification');
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

export type UnwatchedSubscriptions = Subscription & { newEpisodes: number };

function createUnwatchedSubscriptions() {
  const dict: { [key: string]: UnwatchedSubscriptions } = {};
  const { subscribe, set, update } = writable<typeof dict>(dict);
  return {
    subscribe,
    set: (subscriptions: typeof dict) => {
      set(subscriptions);
      store?.set('activeSubscriptions', subscriptions);
    },
    add: (anime: Anime, newEpisodes: number) => {
      update(subscriptions => {
        subscriptions[anime.id] = {
          ...anime,
          lastUpdated: Date.now(),
          added: Date.now(),
          newEpisodes
        };
        store?.set('activeSubscriptions', subscriptions);
        store?.save();
        sendNotification(
          anime.title.english ?? anime.title.native,
          newEpisodes
        );
        return subscriptions;
      });
    },
    updateDate: (id: string) => {
      update(subscriptions => {
        subscriptions[id].lastUpdated = Date.now();
        store?.set('activeSubscriptions', subscriptions);
        return subscriptions;
      });
    },
    remove: (anime: Anime) => {
      update(subscriptions => {
        delete subscriptions[anime.id];
        store?.set('activeSubscriptions', subscriptions);
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
        set(data);
      } else {
        await store.set('activeSubscriptions', {});
      }
    }
  };
}

export const unwatchedSubscriptions = createUnwatchedSubscriptions();
