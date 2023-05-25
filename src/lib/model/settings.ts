import { get, writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Subscription } from './subscriptions';

let store: Store | undefined = undefined;

export type SettingsType = {
  deleteOnWatch: boolean;
  sortSubscriptions: 'lastUpdated' | 'timeAdded' | 'title';
};

const defaultSettings: SettingsType = {
  deleteOnWatch: false,
  sortSubscriptions: 'timeAdded'
};

function createSettings() {
  const { subscribe, set, update } = writable<SettingsType>(defaultSettings);
  return {
    subscribe,
    update: (fn: (settings: SettingsType) => SettingsType) => {
      update(settings => {
        const newSettings = fn(settings);
        store?.set('settings', newSettings);
        return newSettings;
      });
    },
    set: (settings: SettingsType) => {
      set(settings);
      store?.set('settings', settings);
    },
    clear: () => {
      set(defaultSettings);
      store?.set('settings', defaultSettings);
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.settings.dat');
      const data = await store.get<SettingsType>('settings');
      if (data) {
        set(data);
      } else {
        await store.set('settings', defaultSettings);
      }
    }
  };
}

export const settings = createSettings();

function sortUpdated(a: Subscription, b: Subscription) {
  return b.lastUpdated - a.lastUpdated || sortName(a, b);
}

function sortAdded(a: Subscription, b: Subscription) {
  return b.added - a.added || sortUpdated(a, b);
}

function sortName(a: Subscription, b: Subscription) {
  return (a.title.english ?? a.title.native).localeCompare(
    b.title.english ?? b.title.native
  );
}

export function getSortMethod() {
  switch (get(settings).sortSubscriptions) {
    case 'lastUpdated':
      return sortUpdated;
    case 'timeAdded':
      return sortAdded;
    case 'title':
      return sortName;
    default:
      return sortAdded;
  }
}
