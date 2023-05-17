import { writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, EpisodeData, Source } from './Anime';
import { invalidate, preloadData } from '$app/navigation';
import { episodeCache } from './cache';
import Semaphore from './classes/Semaphore';

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
          const episodeIndex = downloads[index].episodes.findIndex(
            ({ episode }) => episode === episodeId
          );
          if (episodeIndex === -1) {
            downloads[index].episodes.unshift({
              episode: episodeId,
              number: epNum
            });
          }
        }
        store?.set('animes', downloads);
        invalidate(`/downloads/${anime.id}`);
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
        if (downloads[index].episodes.length <= 0) {
          downloads.splice(index, 1);
        }
        store?.set('animes', downloads);
        invalidate(`/downloads/${animeId}`);
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

async function sendNotification(title: string, episode: number) {
  const { isPermissionGranted, requestPermission, sendNotification } =
    await import('@tauri-apps/api/notification');
  if (await isPermissionGranted()) {
    sendNotification({
      title: `Downloaded episode ${episode} of ${title}`
    });
  } else if ((await requestPermission()) === 'granted') {
    sendNotification({
      title: `Downloaded episode ${episode} of ${title}`
    });
  } else {
    console.error('Permission not granted');
  }
}

function createDownloading() {
  const semaphore = new Semaphore(5);
  const dict: {
    [key: string]: { anime: Anime; quality: string; progress: number };
  } = {};
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
      try {
        update(downloads => {
          downloads[episodeId] = { anime, quality, progress: 0 };
          return downloads;
        });

        await semaphore.callFunction(async () => {
          await preloadData(`/${anime.id}/${episodeId}`);
          const cache = episodeCache.get(episodeId);
          console.log(cache);
          if (!cache) {
            throw new Error('Episode not found');
          }
          let episodeUrl = cache.sources?.find(s => s.quality === quality)?.url;
          if (!episodeUrl) {
            episodeUrl = cache.sources?.[0]?.url;
            quality = cache.sources?.[0]?.quality;
          }
          if (!episodeUrl) {
            throw new Error('Source not found');
          }
          const { Command } = await import('@tauri-apps/api/shell');
          const { appDataDir, join } = await import('@tauri-apps/api/path');
          const path = await join(
            await appDataDir(),
            'downloads',
            `${episodeId}.mp4`
          );

          // -i {input} -bsf:a aac_adtstoasc -vcodec copy -c copy -crf 50 {output} -hwaccel auto -y
          const command = Command.sidecar('bin/ffmpeg', [
            '-i',
            episodeUrl,
            '-bsf:a',
            'aac_adtstoasc',
            '-vcodec',
            'copy',
            '-c',
            'copy',
            '-crf',
            '50',
            path,
            '-hwaccel',
            'auto',
            '-y'
          ]);
          const output = await command.execute();
          // stderr is used for logging since stdout is used for video data
          console.log(output.stderr);
          console.debug('Downloaded: ', path);

          if (output.code !== 0) {
            throw new Error('Download failed');
          }

          downloads.add(
            episodeId,
            { url: path, quality, isM3U8: false },
            anime,
            episodeNumber
          );

          sendNotification(
            anime.title.english ?? anime.title.romaji,
            episodeNumber
          );
        });
      } catch (e) {
        console.error(e);
      } finally {
        remove(episodeId);
      }
    },
    remove,
    clear: () => {
      set({});
    }
  };
}

export const downloading = createDownloading();
