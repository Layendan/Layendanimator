import type { Arch, OsType } from '@tauri-apps/api/os';
import type { UpdateResult } from '@tauri-apps/api/updater';
import { clearCache } from './cache';
import { connections } from './connections';
import { downloads } from './downloads';
import { searchHistory } from './searchHistory';
import { settings } from './settings';
import { providers } from './source';
import { subscriptions, unwatchedSubscriptions } from './subscriptions';
import { watching } from './watch';
import { notifications } from './notifications';

export async function getVersion(): Promise<string | 'Unknown'> {
  const { getVersion } = await import('@tauri-apps/api/app');
  return getVersion?.() ?? 'Unknown';
}

export async function getOS(): Promise<OsType | 'Unknown'> {
  const { type } = await import('@tauri-apps/api/os');
  return type?.() ?? 'Unknown';
}

export async function getArch(): Promise<Arch | 'Unknown'> {
  const { arch } = await import('@tauri-apps/api/os');
  return arch?.() ?? 'Unknown';
}

export async function checkUpdate(): Promise<UpdateResult> {
  try {
    const { checkUpdate } = await import('@tauri-apps/api/updater');
    const result = await checkUpdate();
    if (result.shouldUpdate) {
      notifications.addNotification({
        title: 'Installing Available',
        message: `Installing version ${result.manifest?.version}.`
      });
      await installUpdate();
    } else {
      notifications.addNotification({
        title: 'No Update Available',
        message: 'You are already on the latest version.'
      });
    }
    return result;
  } catch (e) {
    console.error(e);
    notifications.addNotification({
      title: 'Update Check Failed',
      message: `Failed to check for updates: ${e}`,
      type: 'error'
    });
    throw e;
  }
}

export async function installUpdate(): Promise<void> {
  const { installUpdate } = await import('@tauri-apps/api/updater');
  return installUpdate();
}

export function deleteAllData() {
  connections.clear();
  downloads.clear();
  searchHistory.clear();
  settings.clear();
  providers.clear();
  subscriptions.clear();
  unwatchedSubscriptions.clear();
  watching.clear();
  clearCache();
}
