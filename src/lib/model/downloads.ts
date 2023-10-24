import { invalidate } from '$app/navigation';
import Hls from 'hls.js';
import { get, writable } from 'svelte/store';
import type { Store } from 'tauri-plugin-store-api';
import { episodeCache } from './cache';
import type { Anime, EpisodeData } from './classes/Anime';
import Semaphore from './classes/Semaphore';
import { fetchEpisode } from './fetch';
import { notifications } from './notifications';
import type { Provider } from './source';
import { tasks } from './updates';

let store: Store | undefined = undefined;

export type DownloadedEpisode = {
  animeId: string;
  episode: EpisodeData;
};

export type DownloadedAnime = {
  [key: string]: { anime: Anime; episodes: { [key: string]: EpisodeData } };
};

function createDownloads() {
  const dict: DownloadedAnime = {};
  const { subscribe, set, update } = writable<DownloadedAnime>(dict);
  return {
    subscribe,
    set: (downloads: DownloadedAnime) => {
      set(downloads);
      store?.set('downloads', downloads);
    },
    add: (anime: Anime, episodeId: string, episode: EpisodeData) => {
      update(downloads => {
        const episodes =
          downloads[`${anime.source.id}/${anime.id}`]?.anime.episodes ?? [];
        if (!episodes.find(({ id }) => id === episodeId)) {
          const episode = anime.episodes.find(({ id }) => id === episodeId);
          if (episode) {
            episodes.push(episode);
          }
        }

        downloads[`${anime.source.id}/${anime.id}`] = {
          anime: {
            ...anime,
            episodes: episodes.sort((a, b) => a.number - b.number)
          },
          episodes: {
            ...downloads[`${anime.source.id}/${anime.id}`]?.episodes,
            [episodeId]: episode
          }
        };
        invalidate(`/downloads/${anime.source.id}/${anime.id}/${episodeId}`);
        invalidate(`/downloads/${anime.source.id}/${anime.id}`);
        store?.set('downloads', downloads);
        store?.save();
        return downloads;
      });
    },
    remove: (anime: Anime, episodeId: string) => {
      update(downloads => {
        const data = downloads[`${anime.source.id}/${anime.id}`];

        if (data === undefined) return downloads;

        deleteFiles([
          ...data.anime.episodes.map(episode => episode.image),
          ...data.episodes[episodeId].sources.map(source => source.url),
          ...(data.episodes[episodeId].subtitles?.map(
            subtitle => subtitle.url
          ) ?? [])
        ]);
        downloads[`${anime.source.id}/${anime.id}`].anime.episodes =
          data.anime.episodes.filter(episode => episode.id !== episodeId);
        delete downloads[`${anime.source.id}/${anime.id}`].episodes[episodeId];
        if (
          Object.keys(downloads[`${anime.source.id}/${anime.id}`].episodes)
            .length === 0
        ) {
          deleteFiles([data.anime.image, data.anime.cover]);
          delete downloads[`${anime.source.id}/${anime.id}`];
        }
        episodeCache.delete(`${anime.source.id}/${episodeId}`);
        invalidate(`/downloads/${anime.source.id}/${anime.id}/${episodeId}`);
        invalidate(`/downloads/${anime.source.id}/${anime.id}`);
        store?.set('downloads', downloads);
        store?.save();
        return downloads;
      });
    },
    clear: () => {
      deleteDir();
      set({});
      episodeCache.clear();
      store?.set('downloads', {});
      store?.save();
    },
    initialize: async () => {
      const StoreImport = (await import('tauri-plugin-store-api')).Store;
      store ??= new StoreImport('.downloads.dat');
      const data = await store.get<DownloadedAnime>('downloads');
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
      title: `Downloaded Episode ${episode} of ${title}`
    });
  } else if ((await requestPermission()) === 'granted') {
    sendNotification({
      title: `Downloaded Episode ${episode} of ${title}`
    });
  } else {
    console.error('Permission not granted');
    notifications.addNotification({
      title: 'Permission not granted',
      message: 'Please enable notifications to receive download notifications',
      type: 'error'
    });
    return Promise.reject();
  }
  return Promise.resolve();
}

function createDownloading() {
  const videos = new Semaphore<string>(5);
  const subtitles = new Semaphore<string>(10, 1000);
  const images = new Semaphore<string>(10, 1000);
  const taskId = 'downloading';

  const dict: {
    [key: string]: { anime: Anime; quality: string; progress: number | null };
  } = {};
  const { subscribe, set, update } = writable(dict);

  const remove = (id: string) => {
    update(downloads => {
      delete downloads[id];
      return downloads;
    });
  };

  const cancel = async (id: string) => {
    videos.removeFunction(id);
    subtitles.removeFunction(id);
    images.removeFunction(id);

    remove(id);
    tasks.update(tasksList => {
      const task = tasksList.find(task => task.id === taskId);
      if (task) {
        task.max--;
        if (task.value >= task.max) {
          setTimeout(() => {
            if (task.value >= task.max)
              tasks.update(tasks => tasks.filter(task => task.id !== taskId));
          }, 500);
        }
      }
      return tasksList;
    });
    const { emit } = await import('@tauri-apps/api/event');
    emit(`download-cancel-${encodeId(id)}`);
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
      if (get(downloads)[`${anime.source.id}/${anime.id}`]?.episodes[episodeId])
        return;

      const id = `${anime.source.id}/${anime.id}/${episodeId}`;

      if (get(downloading)[id]) return;

      update(downloads => {
        downloads[id] = { anime, quality, progress: null };
        return downloads;
      });

      tasks.update(tasks => {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
          task.max++;
        } else {
          tasks.push({
            id: taskId,
            title: 'Downloading',
            value: 0,
            max: 1
          });
        }
        return tasks;
      });
      try {
        const [
          { Command },
          { appDataDir, join },
          { writeBinaryFile, writeFile, removeFile, exists, createDir },
          { fetch, ResponseType },
          { once }
        ] = await Promise.all([
          import('@tauri-apps/api/shell'),
          import('@tauri-apps/api/path'),
          import('@tauri-apps/api/fs'),
          import('@tauri-apps/api/http'),
          import('@tauri-apps/api/event')
        ]);
        const dataDir = await appDataDir();
        const directoryPath = await join(dataDir, 'downloads');
        if (!(await exists(directoryPath)))
          await createDir(directoryPath, { recursive: true });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calls: Promise<any>[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const imageCalls: Promise<any>[] = [];

        const video = await videos.callFunction(async () => {
          const cache =
            episodeCache.get(`${anime.source.id}/${episodeId}`) ??
            (await fetchEpisode(episodeId, anime.source));

          if (!cache) {
            throw new Error('Episode not found');
          }

          let episode = cache.sources?.find(s => s.quality === quality);

          if (!episode) {
            episode = cache.sources?.[0];
          }

          if (!episode || !episode?.url) {
            console.error('Video url not found');
            notifications.addNotification({
              title: 'Video url not found',
              message: `Could not find video url for ${
                anime.title.english ?? anime.title.romaji
              } Episode ${episodeNumber}`,
              type: 'error'
            });
            return Promise.reject('Video url not found');
          }

          const videoElement = document.createElement('video');
          let duration = 0;

          if (Hls.isSupported() && episode.isM3U8) {
            const hls = new Hls();
            hls.loadSource(episode.url);
            hls.attachMedia(videoElement);
            hls.once(Hls.Events.LEVEL_LOADED, (_, data) => {
              duration = data.details.totalduration;
              hls.destroy();
              videoElement.remove();
            });
          } else if (episode.isM3U8) {
            console.error('M3U8 not supported');
            notifications.addNotification({
              title: 'M3U8 not supported',
              message: `Could not download the video for ${
                anime.title.english ?? anime.title.romaji
              } Episode ${episodeNumber}`,
              type: 'error'
            });
            return Promise.reject('M3U8 not supported');
          }

          const path = await join(
            directoryPath,
            `${anime.source.id}.${anime.id}.${episodeId}.mp4`
          );

          try {
            await (episode.isM3U8
              ? async () => {
                  const options = [
                    '-i',
                    episode!.url,
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
                    '-progress',
                    '-',
                    '-nostats',
                    '-y'
                  ];

                  // -i {input} -bsf:a aac_adtstoasc -vcodec copy -c copy -crf 50 {output} -hwaccel auto -y
                  const command = Command.sidecar('bin/ffmpeg', options);

                  command.stdout.on('data', data => {
                    const str = data.toString();
                    const match = str.match(/time=(\d+):(\d+):(\d+)/);
                    if (match) {
                      const [, hours, minutes, seconds] = match;
                      const totalSeconds =
                        parseInt(hours) * 3600 +
                        parseInt(minutes) * 60 +
                        parseInt(seconds);
                      update(downloads => {
                        downloads[id].progress = Math.min(
                          totalSeconds / (duration || anime.duration * 60),
                          1
                        );
                        return downloads;
                      });
                    }
                  });

                  const child = await command.spawn();
                  const unlisten = await once(
                    `download-cancel-${encodeId(id)}`,
                    () => {
                      console.debug('Killed: ', path);
                      command.emit('error', 'Killed');
                      child.kill();
                    }
                  );

                  try {
                    await new Promise((resolve, reject) =>
                      command.once('close', resolve).once('error', reject)
                    );
                    console.debug('Downloaded: ', path);
                    return path;
                  } catch (e) {
                    console.error(e);
                    removeFile(path);
                    return Promise.reject(e);
                  } finally {
                    unlisten();
                  }
                }
              : async () => {
                  const response = await fetch<Uint8Array>(episode!.url, {
                    method: 'GET',
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
                })();
          } catch (e) {
            console.error(e);
            removeFile(path);
            return Promise.reject(e);
          }

          return path;
        }, id);

        const cache =
          episodeCache.get(`${anime.source.id}/${episodeId}`) ??
          (await fetchEpisode(episodeId, anime.source));

        if (!cache) {
          throw new Error('Episode not found');
        }

        if (cache.subtitles) {
          cache.subtitles.forEach(subtitle => {
            calls.push(
              subtitles.callFunction(async () => {
                const path = await join(
                  directoryPath,
                  `${anime.source.id}.${anime.id}.${episodeId}.${subtitle.lang}.vtt`
                );

                const response = await fetch<string>(subtitle.url, {
                  method: 'GET',
                  timeout: 30,
                  responseType: ResponseType.Text
                });

                if (!response.ok) {
                  console.error(response);
                  notifications.addNotification({
                    title: 'Subtitle download failed',
                    message: `Could not download the ${subtitle.lang} subtitle for ${anime.title} Episode ${episodeNumber}`,
                    type: 'error'
                  });
                  return Promise.reject();
                }

                const text = response.data;
                await writeFile(path, text);

                console.debug('Downloaded: ', path);

                return path;
              }, id)
            );
          });
        }

        imageCalls.push(
          images.callFunction(async () => {
            const path = await join(
              directoryPath,
              `${anime.source.id}.${anime.id}.${anime.image.split('.').pop()}`
            );

            const response = await fetch<Uint8Array>(anime.image, {
              method: 'GET',
              timeout: 30,
              responseType: ResponseType.Binary
            });

            if (!response.ok) {
              console.error(response);
              notifications.addNotification({
                title: 'Image download failed',
                message: `Could not download the image for ${
                  anime.title.english ?? anime.title.romaji
                }`,
                type: 'error'
              });
              return Promise.reject();
            }

            const buffer = response.data;
            await writeBinaryFile(path, buffer);

            console.debug('Downloaded: ', path);

            return path;
          }, id)
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
              directoryPath,
              `${anime.source.id}.${anime.id}.${episodeId}.${episodeImage
                .split('.')
                .pop()}`
            );

            const response = await fetch<Uint8Array>(episodeImage, {
              method: 'GET',
              timeout: 30,
              responseType: ResponseType.Binary
            });

            if (!response.ok) {
              console.error(response);
              notifications.addNotification({
                title: 'Episode image download failed',
                message: `Could not download the image for ${
                  anime.title.english ?? anime.title.romaji
                } Episode ${episodeNumber}`,
                type: 'error'
              });
              return Promise.reject();
            }

            const buffer = response.data;
            await writeBinaryFile(path, buffer);

            console.debug('Downloaded: ', path);

            return path;
          }, id)
        );

        if (anime.cover) {
          imageCalls.push(
            images.callFunction(async () => {
              const path = await join(
                directoryPath,
                `${anime.source.id}.${anime.id}.cover.${anime.cover
                  .split('.')
                  .pop()}`
              );

              const response = await fetch<Uint8Array>(anime.cover, {
                method: 'GET',
                timeout: 30,
                responseType: ResponseType.Binary
              });

              if (!response.ok) {
                console.error(response);
                notifications.addNotification({
                  title: 'Cover image download failed',
                  message: `Could not download the cover image for ${
                    anime.title.english ?? anime.title.romaji
                  }`,
                  type: 'error'
                });
                return Promise.reject();
              }

              const buffer = response.data;
              await writeBinaryFile(path, buffer);

              console.debug('Downloaded: ', path);

              return path;
            }, id)
          );
        }

        const captionResults = await Promise.all<string>(calls);
        const imageResults = await Promise.allSettled<string>(imageCalls);

        console.debug(video);
        console.debug(captionResults);
        console.debug(imageResults);

        if (!video) {
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
              url: video,
              quality,
              isM3U8: false,
              type: 'video/mp4'
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
        notifications.addNotification({
          title: 'Download complete',
          message: `Downloaded ${
            anime.title.english ?? anime.title.romaji
          } Episode ${episodeNumber}`,
          type: 'success'
        });

        tasks.update(tasks => {
          const task = tasks.find(task => task.id === taskId);
          if (task) {
            task.value++;
            if (task.value >= task.max) {
              setTimeout(() => {
                if (task.value === task.max)
                  tasks.splice(tasks.indexOf(task), 1);
              }, 1000);
            }
          }
          return tasks;
        });
      } catch (e) {
        console.error(e);

        if ((e as string) === 'Killed') return;

        notifications.addNotification({
          title: 'Download failed',
          message: `Could not download ${
            anime.title.english ?? anime.title.romaji
          } Episode ${episodeNumber}`,
          type: 'error'
        });
      } finally {
        remove(id);
      }
    },
    remove,
    cancel,
    clear: () => {
      update(downloads => {
        Object.keys(downloads).forEach(id => {
          cancel(id);
        });
        return {};
      });
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

export async function getDownload(
  animeId: string,
  episodeId: string,
  source: Provider
) {
  const download =
    get(downloads)[`${source.id}/${animeId}`]?.episodes?.[episodeId];
  if (download) {
    return await convertDownloads(download);
  } else {
    return undefined;
  }
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
  const [{ removeDir, createDir }, { appDataDir, join }] = await Promise.all([
    import('@tauri-apps/api/fs'),
    import('@tauri-apps/api/path')
  ]);

  const path = await join(await appDataDir(), 'downloads');

  await removeDir(path, { recursive: true });
  await createDir(path, { recursive: true });
}

function encodeId(id: string) {
  return id.replaceAll(/[^a-zA-Z0-9-/:_]/g, '-');
}
