import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, EpisodeData, Source } from './Anime';
import { preloadData } from '$app/navigation';
import { episodeCache } from './cache';

let store: Store | undefined = undefined;

export type DownloadedEpisode = {
  anime: Anime;
  episode: EpisodeData;
};

function createDownloads() {
  const dict: { [key: string]: DownloadedEpisode } = {};
  const { subscribe, set, update } = writable(dict);
  return {
    subscribe,
    set: (downloads: typeof dict) => {
      set(downloads);
      store?.set('downloads', downloads);
    },
    add: (episodeId: string, source: Source, anime: Anime) => {
      update(downloads => {
        downloads[episodeId] = {
          anime,
          episode: {
            sources: [source],
            download: undefined
          }
        };
        store?.set('downloads', downloads);
        return downloads;
      });
    },
    remove: async (episodeId: string) => {
      const { removeFile } = await import('@tauri-apps/api/fs');
      update(downloads => {
        removeFile(downloads[episodeId].episode.sources[0].url);
        delete downloads[episodeId];
        store?.set('downloads', downloads);
        return downloads;
      });
    },
    clear: async () => {
      const { removeFile } = await import('@tauri-apps/api/fs');
      update(downloads => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_episodeId, val] of Object.entries(downloads)) {
          removeFile(val.episode.sources[0].url);
        }
        store?.set('downloads', {});
        return {};
      });
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.downloads.dat');
      const data = await store.get<typeof dict>('downloads');
      if (data) {
        set(data);
      } else {
        await store.set('downloads', {});
      }
    }
  };
}

export const downloads = createDownloads();

function createDownloading() {
  const dict: { [key: string]: { anime: Anime; quality: string } } = {};
  const { subscribe, set, update } = writable(dict);
  const remove = (episodeId: string) => {
    update(downloads => {
      delete downloads[episodeId];
      return downloads;
    });
  };

  return {
    subscribe,
    set,
    add: async (episodeId: string, anime: Anime, quality: string) => {
      update(downloads => {
        downloads[episodeId] = { anime, quality };
        return downloads;
      });

      const { listen } = await import('@tauri-apps/api/event');
      const { invoke } = await import('@tauri-apps/api/tauri');
      await preloadData(`/${anime.id}/${episodeId}`);
      console.debug('Downloading episode', episodeId);
      const episodeUrl = episodeCache
        .get(episodeId)
        ?.sources?.find(s => s.quality === quality)?.url;
      const unlisten = await listen<{
        progress: number;
        status: 'success' | 'error' | 'downloading';
        logs?: string;
        path: string;
      }>(`download-progress-${episodeId}`, e => {
        console.debug('Download progress', e.payload);
        switch (e.payload.status) {
          case 'success':
            unlisten();
            remove(episodeId);
            downloads.add(
              episodeId,
              { url: e.payload.path, quality: '1080p', isM3U8: false },
              anime
            );
            console.debug('Downloaded episode', episodeId);
            break;
          case 'error':
            unlisten();
            remove(episodeId);
            console.error(
              'Error downloading episode',
              e.payload.logs,
              episodeId
            );
            break;
          case 'downloading':
            console.debug('Downloading episode', e.payload.logs);
            break;
          default:
            unlisten();
            remove(episodeId);
            console.error('Unknown download status', e.payload);
            break;
        }
      });
      invoke('download', {
        episodeId: episodeId,
        episodeUrl
      });
    },
    remove,
    clear: () => {
      set({});
    }
  };
}

export const downloading = createDownloading();
