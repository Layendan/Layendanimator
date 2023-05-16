import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';

let store: Store | undefined = undefined;

export type SettingsType = {
  deleteOnWatch: boolean;
};

const defaultSettings: SettingsType = {
  deleteOnWatch: false
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
      store ??= new Store('.settings.dat');
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
