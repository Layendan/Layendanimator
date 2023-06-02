import { writable, get } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import type { Anime, EpisodeData } from './classes/Anime';
import { invalidate, preloadData } from '$app/navigation';
import { episodeCache } from './cache';
import Semaphore from './classes/Semaphore';

let store: Store | undefined = undefined;

export type DownloadedEpisode = {
  animeId: string;
  episode: EpisodeData;
};

function createDownloads() {
  const dict: {
    [key: string]: { anime: Anime; episodes: { [key: string]: EpisodeData } };
  } = {};
  const { subscribe, set, update } = writable(dict);
  return {
    subscribe,
    set: (downloads: typeof dict) => {
      set(downloads);
      store?.set('downloads', downloads);
    },
    add: (anime: Anime, episodeId: string, episode: EpisodeData) => {
      update(downloads => {
        const episodes = downloads[anime.id]?.anime.episodes ?? [];
        if (!episodes.find(({ id }) => id === episodeId)) {
          const episode = anime.episodes.find(({ id }) => id === episodeId);
          if (episode) {
            episodes.push(episode);
          }
        }

        downloads[anime.id] = {
          anime: {
            ...anime,
            episodes: episodes.sort((a, b) => a.number - b.number)
          },
          episodes: {
            ...downloads[anime.id]?.episodes,
            [episodeId]: episode
          }
        };
        invalidate(`/downloads/${anime.id}`);
        store?.set('downloads', downloads);
        store?.save();
        return downloads;
      });
    },
    remove: (animeId: string, episodeId: string) => {
      update(downloads => {
        const data = downloads[animeId];
        deleteFiles([
          data.anime.image,
          data.anime.cover,
          ...data.anime.episodes.map(episode => episode.image),
          ...data.episodes[episodeId].sources.map(source => source.url),
          ...(data.episodes[episodeId].subtitles?.map(
            subtitle => subtitle.url
          ) ?? [])
        ]);
        downloads[animeId].anime.episodes = data.anime.episodes.filter(
          episode => episode.id !== episodeId
        );
        delete downloads[animeId].episodes[episodeId];
        if (Object.keys(downloads[animeId].episodes).length === 0) {
          delete downloads[animeId];
        }
        invalidate(`/downloads/${animeId}`);
        store?.set('downloads', downloads);
        store?.save();
        return downloads;
      });
    },
    clear: () => {
      deleteDir();
      set({});
      store?.set('downloads', {});
      store?.save();
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
    return Promise.reject();
  }
  return Promise.resolve();
}

function createDownloading() {
  const videos = new Semaphore<string>(5);
  const subtitles = new Semaphore<string>(10, 1000);
  const images = new Semaphore<string>(10, 1000);

  const dict: {
    [key: string]: { anime: Anime; quality: string; progress: number | null };
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
      if (get(downloads)[anime.id]?.episodes[episodeId]) return;

      try {
        update(downloads => {
          downloads[episodeId] = { anime, quality, progress: null };
          return downloads;
        });

        await preloadData(`/${anime.id}/${episodeId}`);
        const cache = episodeCache.get(episodeId);

        console.log(cache);

        if (!cache) {
          throw new Error('Episode not found');
        }

        const { Command } = await import('@tauri-apps/api/shell');
        const { appDataDir, join } = await import('@tauri-apps/api/path');
        const { writeBinaryFile, writeFile } = await import(
          '@tauri-apps/api/fs'
        );
        const { fetch, ResponseType } = await import('@tauri-apps/api/http');
        const dataDir = await appDataDir();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calls: Promise<any>[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imageCalls: Promise<any>[] = [];

        const video = videos.callFunction(async () => {
          let episodeUrl = cache.sources?.find(s => s.quality === quality)?.url;

          if (!episodeUrl) {
            episodeUrl = cache.sources?.[0]?.url;
            quality = cache.sources?.[0]?.quality;
          }

          if (!episodeUrl) {
            console.error('Source not found');
            return Promise.reject();
          }

          const path = await join(
            dataDir,
            'downloads',
            `${anime.id}.${episodeId}.mp4`
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

          console.debug('Downloaded: ', path);

          if (output.code !== 0) {
            console.error(output);
            return Promise.reject();
          }

          return path;
        });

        if (cache.subtitles) {
          cache.subtitles.forEach(subtitle => {
            calls.push(
              subtitles.callFunction(async () => {
                const path = await join(
                  dataDir,
                  'downloads',
                  `${anime.id}.${episodeId}.${subtitle.lang}.vtt`
                );

                const response = await fetch<string>(subtitle.url, {
                  method: 'GET',
                  timeout: 30,
                  responseType: ResponseType.Text
                });

                if (!response.ok) {
                  console.error(response);
                  return Promise.reject();
                }

                const text = response.data;
                await writeFile(path, text);

                console.debug('Downloaded: ', path);

                return path;
              })
            );
          });
        }

        imageCalls.push(
          images.callFunction(async () => {
            const path = await join(
              dataDir,
              'downloads',
              `${anime.id}.${anime.image.split('.').pop()}`
            );

            const response = await fetch<Uint8Array>(anime.image, {
              method: 'GET',
              timeout: 30,
              responseType: ResponseType.Binary
            });

            if (!response.ok) {
              console.error(response);
              return Promise.reject();
            }

            const buffer = response.data;
            await writeBinaryFile(path, buffer);

            console.debug('Downloaded: ', path);

            return path;
          })
        );

        imageCalls.push(
          images.callFunction(async () => {
            const episodeImage = anime.episodes.find(
              ({ id }) => id === episodeId
            )?.image;

            if (!episodeImage) {
              return Promise.reject();
            }

            const path = await join(
              dataDir,
              'downloads',
              `${anime.id}.${episodeId}.${episodeImage.split('.').pop()}`
            );

            const response = await fetch<Uint8Array>(episodeImage, {
              method: 'GET',
              timeout: 30,
              responseType: ResponseType.Binary
            });

            if (!response.ok) {
              console.error(response);
              return Promise.reject();
            }

            const buffer = response.data;
            await writeBinaryFile(path, buffer);

            console.debug('Downloaded: ', path);

            return path;
          })
        );

        if (anime.cover) {
          imageCalls.push(
            images.callFunction(async () => {
              const path = await join(
                dataDir,
                'downloads',
                `${anime.id}.cover.${anime.cover.split('.').pop()}`
              );

              const response = await fetch<Uint8Array>(anime.cover, {
                method: 'GET',
                timeout: 30,
                responseType: ResponseType.Binary
              });

              if (!response.ok) {
                console.error(response);
                return Promise.reject();
              }

              const buffer = response.data;
              await writeBinaryFile(path, buffer);

              console.debug('Downloaded: ', path);

              return path;
            })
          );
        }

        const videoPath = await video;
        const captionResults = await Promise.all<string>(calls);
        const imageResults = await Promise.allSettled<string>(imageCalls);

        console.log(videoPath);
        console.log(captionResults);
        console.log(imageResults);

        if (!videoPath) {
          throw new Error('Download failed');
        }

        const animeObj: Anime = {
          ...anime,
          image:
            imageResults[0].status === 'fulfilled'
              ? imageResults[0].value
              : anime.image,
          cover:
            anime.cover && imageResults[2].status === 'fulfilled'
              ? imageResults[2].value
              : imageResults[0].status === 'fulfilled'
              ? imageResults[0].value
              : anime.cover ?? anime.image,
          episodes: anime.episodes.map(episode => ({
            ...episode,
            image:
              episode.id === episodeId && imageResults[1].status === 'fulfilled'
                ? imageResults[1].value
                : episode.image
          }))
        };
        console.debug(animeObj);

        const episodeObj: EpisodeData = {
          sources: [
            {
              url: videoPath,
              quality,
              isM3U8: false
            }
          ],
          subtitles: captionResults.map(path => ({
            url: path,
            lang: path.split('.').slice(-2, -1)[0]
          }))
        };
        console.debug(episodeObj);

        downloads.add(animeObj, episodeId, episodeObj);

        sendNotification(
          anime.title.english ?? anime.title.romaji,
          episodeNumber
        );
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

export async function convertAnime(anime: Anime): Promise<Anime> {
  const { convertFileSrc } = await import('@tauri-apps/api/tauri');

  return {
    ...anime,
    image: anime.image.startsWith('http')
      ? anime.image
      : convertFileSrc(anime.image),
    cover: anime.cover.startsWith('http')
      ? anime.cover
      : convertFileSrc(anime.cover),
    episodes: anime.episodes.map(ep => ({
      ...ep,
      image: ep.image.startsWith('http') ? ep.image : convertFileSrc(ep.image)
    }))
  };
}

export async function convertDownloads(
  episode: EpisodeData
): Promise<EpisodeData> {
  const { convertFileSrc } = await import('@tauri-apps/api/tauri');

  return {
    ...episode,
    sources: episode.sources.map(source => ({
      ...source,
      url: convertFileSrc(source.url)
    })),
    subtitles: episode.subtitles?.map(subtitle => ({
      ...subtitle,
      url: convertFileSrc(subtitle.url)
    }))
  };
}

async function deleteFiles(files: string[]) {
  const { removeFile } = await import('@tauri-apps/api/fs');

  files.forEach(file => {
    removeFile(file);
  });
}

async function deleteDir() {
  const { removeDir, createDir } = await import('@tauri-apps/api/fs');
  const { appDataDir, join } = await import('@tauri-apps/api/path');

  const path = await join(await appDataDir(), 'downloads');

  await removeDir(path, { recursive: true });
  await createDir(path, { recursive: true });
}
