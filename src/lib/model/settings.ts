import { get, writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import { clearCache } from './cache';
import { connections } from './connections';
import { downloads } from './downloads';
import { deleteAllData } from './info';
import { notifications } from './notifications';
import { searchHistory } from './searchHistory';
import { providers } from './source';
import {
  subscriptions,
  unwatchedSubscriptions,
  type Subscription
} from './subscriptions';
import { checkAndConvertTheme, defaultThemes, type Theme } from './theme';
import { watching } from './watch';

let store: Store | undefined = undefined;

export type SettingsType = {
  deleteOnWatch: boolean;
  notifications: boolean;
  isSubtitles: boolean;
  filler: boolean;
  parallax: boolean;
  showSourcesOnAnime: boolean;
  checkCompletedUpdates: boolean;
  sortSubscriptions: 'lastUpdated' | 'timeAdded' | 'title' | 'nextEpisode';

  discordRPC: 'enabled' | 'disabled'; // TODO: Update when watch2gether is added

  isEpisodeAscending: boolean;
  showWatchedEpisodes: boolean;
  showThumbnail: boolean;

  playerVolume: number;
  playerMuted: boolean;

  theme: Theme;
  themes: {
    [key: string]: Theme;
  };

  version: string;
};

const defaultSettings: SettingsType = {
  deleteOnWatch: true,
  notifications: true,
  isSubtitles: true,
  filler: true,
  parallax: true,
  showSourcesOnAnime: true,
  checkCompletedUpdates: false,
  sortSubscriptions: 'timeAdded',
  discordRPC: 'enabled',
  isEpisodeAscending: true,
  showWatchedEpisodes: true,
  showThumbnail: true,
  playerVolume: 1,
  playerMuted: false,
  theme: defaultThemes.system,
  themes: defaultThemes,
  version: '0.0.0'
};

// Prevent modification of default settings
Object.freeze(defaultSettings);

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
        const newData = { ...defaultSettings, ...data };

        // TODO: Remove this in a few version updates
        // if themes in newData are using old hsl, then convert to oklch
        const themes = { ...defaultThemes, ...newData.themes };
        const newThemes = Object.entries(themes).reduce(
          (acc, [key, value]) => {
            acc[key] = checkAndConvertTheme(value);
            return acc;
          },
          {} as Record<string, Theme>
        );

        newData.themes = newThemes;
        newData.theme = newThemes[newData.theme.name] ?? defaultThemes.system;
        set(newData);
      } else {
        await store.set('settings', defaultSettings);
      }
    }
  };
}

export const settings = createSettings();

function sortUpdated(
  [keya, a]: [string, Subscription],
  [keyb, b]: [string, Subscription]
) {
  return b.lastUpdated - a.lastUpdated || sortName([keya, a], [keyb, b]);
}

function sortAdded(
  [keya, a]: [string, Subscription],
  [keyb, b]: [string, Subscription]
) {
  return b.added - a.added || sortUpdated([keya, a], [keyb, b]);
}

function sortNextEpisode(
  [keya, a]: [string, Subscription],
  [keyb, b]: [string, Subscription]
) {
  return (
    (a.nextAiringEpisode?.airingTime ?? Infinity) -
      (b.nextAiringEpisode?.airingTime ?? Infinity) ||
    sortAdded([keya, a], [keyb, b])
  );
}

function sortName(
  [keya, a]: [string, Subscription],
  [keyb, b]: [string, Subscription]
) {
  return (
    (a.title.english ?? a.title.native).localeCompare(
      b.title.english ?? b.title.native
    ) || keya.localeCompare(keyb)
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
    case 'nextEpisode':
      return sortNextEpisode;
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
  },
  {
    label: 'Clear Search History',
    action: searchHistory.clear
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
      const [{ open }, { join, appDataDir }] = await Promise.all([
        import('@tauri-apps/api/shell'),
        import('@tauri-apps/api/path')
      ]);
      open(await join(await appDataDir(), 'downloads'));
    }
  },
  {
    label: 'Open Logs Folder',
    danger: false,
    action: async () => {
      const [{ open }, { appLogDir }] = await Promise.all([
        import('@tauri-apps/api/shell'),
        import('@tauri-apps/api/path')
      ]);
      open(await appLogDir());
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
        notifications.addNotification({
          title: 'Permission not granted',
          message:
            'Please enable notifications to receive download notifications',
          type: 'error'
        });
      }
      notifications.addNotification({
        title: 'Test Notification',
        message: 'This is a test notification'
      });
    }
  },
  {
    label: 'Delete Themes',
    danger: true,
    action: async () => {
      const { confirm } = await import('@tauri-apps/api/dialog');
      const confirmed = await confirm(
        'This action cannot be reverted. Are you sure?',
        {
          title: 'Delete All Themes',
          type: 'warning',
          okLabel: "Yes, I'm Sure"
        }
      );
      if (confirmed) {
        settings.update(settings => {
          const newSettings = { ...settings };
          newSettings.theme = defaultThemes.system;
          newSettings.themes = defaultThemes;
          return newSettings;
        });
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
