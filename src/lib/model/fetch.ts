import {
  animeCache,
  carouselPage,
  episodeCache,
  popularAnimes,
  recentEpisodes,
  searchCache,
  trendingAnimes
} from '$lib/model/cache';
import type { Anime, EpisodeData, RecentAnime } from '$lib/model/classes/Anime';
import { ANIME, META } from '@consumet/extensions';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import Semaphore from './classes/Semaphore';
import { notifications } from './notifications';
import { settings } from './settings';
import { providers, type Provider } from './source';
import { subscriptions, unwatchedSubscriptions } from './subscriptions';

const timeout = 15_000;

export async function fetchRecentEpisodes(
  source: Anime['source'],
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchRecentEpisodes)
    error(500, 'Source script not found');

  const results = await safeEval<RecentAnime[]>(
    userSource.scripts.fetchRecentEpisodes,
    { args: [page, perPage] }
  );
  const recent = results.map(anime => ({
    id: anime.id,
    title: anime.title,
    image: anime.image,
    episodeNumber: anime.episodeNumber,
    color: anime.color,
    isAdult: anime.isAdult,
    source: {
      id: userSource.id,
      name: userSource.name,
      url: userSource.url,
      shareLinks: userSource.shareLinks
    }
  }));
  const animes = [...(recentEpisodes.get(source.id) ?? []), ...recent].filter(
    (anime, index, self) =>
      index ===
      self.findIndex(
        ({ id, episodeNumber }) =>
          `${id}/${episodeNumber}` === `${anime.id}/${anime.episodeNumber}`
      )
  );
  recentEpisodes.set(source.id, animes);
  return recent;
}

export async function fetchTrendingAnime(
  source: Anime['source'],
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchTrendingAnime)
    error(500, 'Source script not found');

  let provider;

  switch (source.id) {
    case 'gogoanime':
      provider = new ANIME.Gogoanime();
      break;
    case 'zoro':
      provider = new ANIME.Zoro();
      break;
  }

  if (provider) {
    const metaProvider = new META.Anilist(provider);
    const trendingRes = (
      await metaProvider.fetchTrendingAnime(page, perPage ?? 25)
    ).results.map(anime => ({
      id: anime.id,
      title: anime.title,
      description: anime.description,
      image: anime.image,
      cover: anime.cover,
      color: anime.color,
      isAdult: anime.isAdult,
      trailer: anime.trailer,
      source: {
        id: userSource.id,
        name: userSource.name,
        url: userSource.url,
        shareLinks: userSource.shareLinks
      }
    })) as Anime[];

    const animesRes = [
      ...(trendingAnimes.get(source.id) ?? []),
      ...trendingRes
    ].filter(
      (anime, index, self) =>
        index === self.findIndex(({ id }) => id === anime.id)
    );
    trendingAnimes.set(source.id, animesRes);
    carouselPage.update(page => ({
      ...page,
      [source.id]: 0
    }));
    return trendingRes;
  }

  const results = await safeEval<Anime[]>(
    userSource.scripts.fetchTrendingAnime,
    {
      args: [page, perPage]
    }
  );
  const trending = results.map(anime => ({
    id: anime.id,
    title: anime.title,
    description: anime.description,
    image: anime.image,
    cover: anime.cover,
    color: anime.color,
    isAdult: anime.isAdult,
    trailer: anime.trailer,
    source: {
      id: userSource.id,
      name: userSource.name,
      url: userSource.url,
      shareLinks: userSource.shareLinks
    }
  }));
  const animes = [...(trendingAnimes.get(source.id) ?? []), ...trending].filter(
    (anime, index, self) =>
      index === self.findIndex(({ id }) => id === anime.id)
  );
  trendingAnimes.set(source.id, animes);
  carouselPage.update(page => ({
    ...page,
    [source.id]: 0
  }));
  return trending;
}

export async function fetchPopularAnime(
  source: Anime['source'],
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchPopularAnime)
    error(500, 'Source script not found');

  let provider;

  switch (source.id) {
    case 'gogoanime':
      provider = new ANIME.Gogoanime();
      break;
    case 'zoro':
      provider = new ANIME.Zoro();
      break;
  }

  if (provider) {
    const metaProvider = new META.Anilist(provider);
    const popularRes = (
      await metaProvider.fetchPopularAnime(page, perPage ?? 25)
    ).results.map(anime => ({
      id: anime.id,
      title: anime.title,
      image: anime.image,
      color: anime.color,
      isAdult: anime.isAdult,
      source: {
        id: userSource.id,
        name: userSource.name,
        url: userSource.url,
        shareLinks: userSource.shareLinks
      }
    })) as Anime[];

    const animesRes = [
      ...(popularAnimes.get(source.id) ?? []),
      ...popularRes
    ].filter(
      (anime, index, self) =>
        index === self.findIndex(({ id }) => id === anime.id)
    );
    popularAnimes.set(source.id, animesRes);
    return popularRes;
  }

  const results = await safeEval<Anime[]>(
    userSource.scripts.fetchPopularAnime,
    {
      args: [page, perPage]
    }
  );
  const popular = results.map(anime => ({
    id: anime.id,
    title: anime.title,
    image: anime.image,
    color: anime.color,
    isAdult: anime.isAdult,
    source: {
      id: userSource.id,
      name: userSource.name,
      url: userSource.url,
      shareLinks: userSource.shareLinks
    }
  }));
  const animes = [...(popularAnimes.get(source.id) ?? []), ...popular].filter(
    (anime, index, self) =>
      index === self.findIndex(({ id }) => id === anime.id)
  );
  popularAnimes.set(source.id, animes);
  return popular;
}

export async function fetchAnime(
  id: string,
  source: Anime['source']
): Promise<Anime> {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchAnimeInfo)
    error(500, 'Source script not found');

  let provider;

  switch (source.id) {
    case 'gogoanime':
      provider = new ANIME.Gogoanime();
      break;
    case 'zoro':
      provider = new ANIME.Zoro();
      break;
  }

  const { isSubtitles, filler } = get(settings);

  if (provider) {
    const metaProvider = new META.Anilist(provider);
    const res = (await metaProvider.fetchAnimeInfo(
      id,
      !isSubtitles,
      filler
    )) as Anime;

    const anime: Anime = {
      id: res.id,
      title: res.title,
      description: res.description,
      image: res.image,
      cover: res.cover,
      color: res.color,
      isAdult: res.isAdult,
      episodes: res.episodes.map(episode => ({
        id: episode.id,
        title: episode.title,
        description: episode.description,
        image: episode.image,
        number: episode.number
      })),
      status: res.status,
      nextAiringEpisode: res.nextAiringEpisode,
      rating: res.rating,
      genres: res.genres,
      season: res.season,
      subOrDub: res.subOrDub,
      type: res.type,
      characters: res.characters,
      recommendations: (res.recommendations ?? []).map(r => ({
        ...r,
        source: {
          id: userSource.id,
          name: userSource.name,
          url: userSource.url,
          shareLinks: userSource.shareLinks
        }
      })),
      relations: (res.relations ?? []).map(r => ({
        ...r,
        source: {
          id: userSource.id,
          name: userSource.name,
          url: userSource.url,
          shareLinks: userSource.shareLinks
        }
      })),
      source: {
        id: userSource.id,
        name: userSource.name,
        url: userSource.url,
        shareLinks: userSource.shareLinks
      }
    };

    animeCache.set(`${source.id}/${id}`, anime);

    const sub = get(subscriptions)[`${anime.source.id}/${anime.id}`];
    const unwatched = get(unwatchedSubscriptions)[
      `${anime.source.id}/${anime.id}`
    ];
    if (sub && sub.episodes !== undefined) {
      if (sub.episodes.length < anime.episodes.length) {
        subscriptions.remove(anime);
        unwatchedSubscriptions.add(
          anime,
          anime.episodes
            .slice(-(anime.episodes.length - sub.episodes.length))
            .map(({ id }) => id)
        );
      } else {
        subscriptions.updateDate({
          ...anime,
          nextAiringEpisode: anime.nextAiringEpisode
            ? sub.nextAiringEpisode ?? anime.nextAiringEpisode
            : undefined,
          status: sub.status ?? anime.status
        });
      }
    } else if (unwatched && unwatched.episodes !== undefined) {
      if (unwatched.episodes.length < anime.episodes.length)
        unwatchedSubscriptions.add(anime, [
          ...anime.episodes
            .slice(-(anime.episodes.length - unwatched.episodes.length))
            .map(({ id }) => id),
          ...Array.from(unwatched.newEpisodes)
        ]);
      else {
        unwatchedSubscriptions.updateDate({
          ...anime,
          nextAiringEpisode: anime.nextAiringEpisode
            ? unwatched.nextAiringEpisode ?? anime.nextAiringEpisode
            : undefined,
          status: unwatched.status ?? anime.status
        });
      }
    }

    return anime;
  }

  const res: Anime = await safeEval<Anime>(userSource.scripts.fetchAnimeInfo, {
    args: [id, isSubtitles, filler]
  });

  if (res) {
    const anime: Anime = {
      id: res.id,
      title: res.title,
      description: res.description,
      image: res.image,
      cover: res.cover,
      color: res.color,
      isAdult: res.isAdult,
      episodes: res.episodes.map(episode => ({
        id: episode.id,
        title: episode.title,
        description: episode.description,
        image: episode.image,
        number: episode.number
      })),
      status: res.status,
      nextAiringEpisode: res.nextAiringEpisode,
      rating: res.rating,
      genres: res.genres,
      season: res.season,
      subOrDub: res.subOrDub,
      type: res.type,
      characters: res.characters,
      recommendations: (res.recommendations ?? []).map(r => ({
        ...r,
        source: {
          id: userSource.id,
          name: userSource.name,
          url: userSource.url,
          shareLinks: userSource.shareLinks
        }
      })),
      relations: (res.relations ?? []).map(r => ({
        ...r,
        source: {
          id: userSource.id,
          name: userSource.name,
          url: userSource.url,
          shareLinks: userSource.shareLinks
        }
      })),
      source: {
        id: userSource.id,
        name: userSource.name,
        url: userSource.url,
        shareLinks: userSource.shareLinks
      }
    };

    animeCache.set(`${source.id}/${id}`, anime);

    const sub = get(subscriptions)[`${anime.source.id}/${anime.id}`];
    const unwatched = get(unwatchedSubscriptions)[
      `${anime.source.id}/${anime.id}`
    ];
    if (sub && sub.episodes !== undefined) {
      if (sub.episodes.length < anime.episodes.length) {
        subscriptions.remove(anime);
        unwatchedSubscriptions.add(
          anime,
          anime.episodes
            .slice(-(anime.episodes.length - sub.episodes.length))
            .map(({ id }) => id)
        );
      } else {
        subscriptions.updateDate({
          ...anime,
          nextAiringEpisode: anime.nextAiringEpisode
            ? sub.nextAiringEpisode ?? anime.nextAiringEpisode
            : undefined,
          status: sub.status ?? anime.status
        });
      }
    } else if (unwatched && unwatched.episodes !== undefined) {
      if (unwatched.episodes.length < anime.episodes.length)
        unwatchedSubscriptions.add(anime, [
          ...anime.episodes
            .slice(-(anime.episodes.length - unwatched.episodes.length))
            .map(({ id }) => id),
          ...Array.from(unwatched.newEpisodes)
        ]);
      else {
        unwatchedSubscriptions.updateDate({
          ...anime,
          nextAiringEpisode: anime.nextAiringEpisode
            ? unwatched.nextAiringEpisode ?? anime.nextAiringEpisode
            : undefined,
          status: unwatched.status ?? anime.status
        });
      }
    }

    return anime;
  } else {
    notifications.addNotification({
      title: 'Anime not found',
      message: `The anime with id ${id} was not found.`,
      type: 'error'
    });
    error(404, 'Anime not found');
  }
}

export async function fetchEpisode(id: string, source: Anime['source']) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchEpisodes)
    error(500, 'Source script not found');

  // let provider;

  // const { axiosTauriApiAdapter } = await import('axios-tauri-api-adapter');
  // switch (source.id) {
  //   case 'gogoanime':
  //     provider = new ANIME.Gogoanime(
  //       undefined,
  //       undefined,
  //       axiosTauriApiAdapter
  //     );
  //     break;
  //   case 'zoro':
  //     provider = new ANIME.Zoro();
  //     break;
  // }

  // if (provider) {
  //   // provider.setProxy({ url: 'https://corsproxy.io/?' });
  //   const metaProvider = new META.Anilist(provider);

  //   metaProvider.setAxiosAdapter(axiosTauriApiAdapter);
  //   provider.setAxiosAdapter(axiosTauriApiAdapter);

  //   const res = (await metaProvider.fetchEpisodeSources(id)) as EpisodeData;

  //   if (res) {
  //     episodeCache.set(`${source.id}/${id}`, res);
  //     return res;
  //   } else {
  //     notifications.addNotification({
  //       title: 'Episode could not be found',
  //       message: `The episode with id ${id} was not found.`,
  //       type: 'error'
  //     });
  //     error(404, 'Episode not found');
  //   }
  // }

  const episode = await safeEval<EpisodeData>(
    userSource.scripts.fetchEpisodes,
    {
      args: [id]
    }
  );

  if (episode) {
    episodeCache.set(`${source.id}/${id}`, episode);
  } else {
    notifications.addNotification({
      title: 'Episode could not be found',
      message: `The episode with id ${id} was not found.`,
      type: 'error'
    });
    error(404, 'Episode not found');
  }

  return episode;
}

export async function fetchSearch(
  query: string,
  source: Provider,
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.search) error(500, 'Source script not found');

  let provider;

  switch (source.id) {
    case 'gogoanime':
      provider = new ANIME.Gogoanime();
      break;
    case 'zoro':
      provider = new ANIME.Zoro();
      break;
  }

  if (provider) {
    const metaProvider = new META.Anilist(provider);
    const results = (
      await metaProvider.search(query, page, perPage)
    ).results.map(anime => ({
      ...anime,
      source
    })) as Anime[];

    const animes = [
      ...(get(searchCache)[source.id]?.get(query) ?? []),
      ...results
    ].filter(
      (anime, index, self) =>
        index === self.findIndex(({ id }) => id === anime.id)
    );
    get(searchCache)[source.id]?.set(query, animes);
    return results;
  }

  const results = (
    await safeEval<Anime[]>(userSource.scripts.search, {
      args: [query, page, perPage]
    })
  ).map(anime => ({
    ...anime,
    source
  }));

  const animes = [
    ...(get(searchCache)[source.id]?.get(query) ?? []),
    ...results
  ].filter(
    (anime, index, self) =>
      index === self.findIndex(({ id }) => id === anime.id)
  );
  get(searchCache)[source.id]?.set(query, animes);

  return results;
}

// https://stackoverflow.com/a/37154736
export async function safeEval<T>(
  code: string,
  settings?: {
    timeout?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args?: any[];
  }
): Promise<T> {
  return new Promise(function (resolve, reject) {
    const blobURL = URL.createObjectURL(
      new Blob(
        [
          '(',
          function () {
            addEventListener('message', async (e: MessageEvent) => {
              try {
                const functionStr = e.data.shift();
                const functionObj = new Function(`return ${functionStr}`)();
                postMessage(await functionObj(...e.data));
              } catch (err) {
                console.error(err);
                postMessage({ error: (err as Error).message });
              }
            });
          }.toString(),
          ')()'
        ],
        { type: 'application/javascript' }
      )
    );

    const worker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    worker.onmessage = evt => {
      worker.terminate();
      if (evt.data === undefined) reject(new Error('No data returned'));
      if (evt.data?.error) reject(new Error(evt.data.error));
      else resolve(evt.data);
    };

    worker.onerror = evt => {
      worker.terminate();
      reject(new Error(evt.message));
    };

    worker.postMessage([code, ...(settings?.args ?? [])]);

    setTimeout(() => {
      worker.terminate();
      reject(new Error('The worker timed out.'));
    }, settings?.timeout ?? timeout);
  });
}

export const taskScheduler = new Semaphore(5);
