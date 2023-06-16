import { get, writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import {
  unwatchedSubscriptions,
  type Subscription,
  subscriptions
} from './subscriptions';
import { clearCache } from './cache';
import { watching } from './watch';
import { deleteAllData } from './info';
import { downloads } from './downloads';
import { connections } from './connections';
import { providers } from './source';

let store: Store | undefined = undefined;

export type SettingsType = {
  deleteOnWatch: boolean;
  sortSubscriptions: 'lastUpdated' | 'timeAdded' | 'title';
  theme: 'system' | 'light' | 'dark' | string;
};

const defaultSettings: SettingsType = {
  deleteOnWatch: true,
  sortSubscriptions: 'timeAdded',
  theme: 'system'
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

export const webData: { label: string; action: () => void }[] = [
  {
    label: 'Clear Cache',
    action: clearCache
  },
  {
    label: 'Clear Subscriptions',
    action: () => {
      unwatchedSubscriptions.clear();
      subscriptions.clear();
    }
  },
  {
    label: 'Clear Watch History',
    action: watching.clear
  }
];

export const tauriData: {
  label: string;
  danger: boolean;
  action: () => void;
}[] = [
  {
    label: 'Clear Sources',
    danger: false,
    action: providers.clear
  },
  {
    label: 'Clear Connections',
    danger: false,
    action: connections.clear
  },
  {
    label: 'Open Downloads Folder',
    danger: false,
    action: async () => {
      const { open } = await import('@tauri-apps/api/shell');
      const { join, appDataDir } = await import('@tauri-apps/api/path');
      await open(await join(await appDataDir(), 'downloads'));
    }
  },
  {
    label: 'Send Test Notification',
    danger: false,
    action: async () => {
      const { isPermissionGranted, requestPermission, sendNotification } =
        await import('@tauri-apps/api/notification');
      if (await isPermissionGranted()) {
        sendNotification({
          title: 'Test Notification',
          body: 'This is a test notification'
        });
      } else if ((await requestPermission()) === 'granted') {
        sendNotification({
          title: 'Test Notification',
          body: 'This is a test notification'
        });
      } else {
        console.error('Notification permission not granted');
      }
    }
  },
  {
    label: 'Delete Downloads',
    danger: true,
    action: async () => {
      const { confirm } = await import('@tauri-apps/api/dialog');
      const confirmed = await confirm(
        'This action cannot be reverted. Are you sure?',
        {
          title: 'Delete All Downloads',
          type: 'warning',
          okLabel: "Yes, I'm Sure"
        }
      );
      if (confirmed) downloads.clear();
    }
  },
  {
    label: 'Delete All Data',
    danger: true,
    action: async () => {
      const { confirm } = await import('@tauri-apps/api/dialog');
      const confirmed = await confirm(
        'This action cannot be reverted. Are you sure?',
        {
          title: 'Delete All Data',
          type: 'warning',
          okLabel: "Yes, I'm Sure"
        }
      );
      if (confirmed) deleteAllData();
    }
  }
];
