import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, EpisodeData, Source } from './Anime';

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
