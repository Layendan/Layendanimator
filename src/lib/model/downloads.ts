import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, EpisodeData, Source } from './Anime';
import { preloadData } from '$app/navigation';
import { episodeCache } from './cache';

let store: Store | undefined = undefined;

export type DownloadedEpisode = {
  animeId: string;
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
    add: (
      episodeId: string,
      source: Source,
      anime: Anime,
      episodeNumber: number
    ) => {
      update(downloads => {
        downloads[episodeId] = {
          animeId: anime.id,
          episode: {
            sources: [source],
            download: undefined
          }
        };
        store?.set('downloads', downloads);
        downloadedAnimes.add(episodeId, episodeNumber, anime);
        store?.save();
        return downloads;
      });
    },
    remove: async (episodeId: string) => {
      const { removeFile } = await import('@tauri-apps/api/fs');
      update(downloads => {
        const data = downloads[episodeId];
        removeFile(data.episode.sources[0].url);
        downloadedAnimes.remove(data.animeId, episodeId);
        delete downloads[episodeId];
        store?.set('downloads', downloads);
        store?.save();
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
        downloadedAnimes.clear();
        store?.save();
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

function createDownloadedAnimes() {
  type Download = {
    anime: Anime;
    episodes: { episode: string; number: number }[];
  };
  const { subscribe, set, update } = writable<Download[]>([]);
  return {
    subscribe,
    set: (downloads: Download[]) => {
      set(downloads);
      store?.set('animes', downloads);
    },
    add: (episodeId: string, epNum: number, anime: Anime) => {
      update(downloads => {
        const index = downloads.findIndex(
          ({ anime: { id } }) => id === anime.id
        );
        if (index === -1) {
          downloads.unshift({
            anime,
            episodes: [{ episode: episodeId, number: epNum }]
          });
        } else {
          downloads[index].episodes.unshift({
            episode: episodeId,
            number: epNum
          });
        }
        store?.set('animes', downloads);
        return downloads;
      });
    },
    remove: (animeId: string, episodeId: string) => {
      update(downloads => {
        const index = downloads.findIndex(
          ({ anime: { id } }) => id === animeId
        );
        if (index === -1) {
          return downloads;
        }
        const episodeIndex = downloads[index].episodes.findIndex(
          ({ episode }) => episode === episodeId
        );
        if (episodeIndex === -1) {
          return downloads;
        }
        downloads[index].episodes.splice(episodeIndex, 1);
        if (downloads[index].episodes.length === 0) {
          downloads.splice(index, 1);
        }
        store?.set('animes', downloads);
        return downloads;
      });
    },
    clear: () => {
      set([]);
      store?.set('animes', []);
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.downloads.dat');
      const data = await store.get<Download[]>('animes');
      if (data) {
        set(data);
      } else {
        await store.set('animes', []);
      }
    }
  };
}

export const downloadedAnimes = createDownloadedAnimes();

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
    add: async (
      episodeId: string,
      anime: Anime,
      quality: string,
      episodeNumber: number
    ) => {
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
              anime,
              episodeNumber
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
