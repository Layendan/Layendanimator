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
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { notifications } from './notifications';
import { settings } from './settings';
import { providers, type Provider } from './source';
import { subscriptions, unwatchedSubscriptions } from './subscriptions';

const timeout = 15_000;

export async function fetchRecentEpisodes(
  source: Provider,
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchRecentEpisodes)
    throw error(500, 'Source script not found');

  const results = await safeEval<RecentAnime[]>(
    userSource.scripts.fetchRecentEpisodes,
    { args: [page, perPage] }
  );
  const recent = results.map(anime => ({
    ...anime,
    source
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
  source: Provider,
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchTrendingAnime)
    throw error(500, 'Source script not found');

  const results = await safeEval<Anime[]>(
    userSource.scripts.fetchTrendingAnime,
    {
      args: [page, perPage]
    }
  );
  const trending = results.map(anime => ({
    ...anime,
    source
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
  source: Provider,
  page?: number,
  perPage?: number
) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchPopularAnime)
    throw error(500, 'Source script not found');

  const results = await safeEval<Anime[]>(
    userSource.scripts.fetchPopularAnime,
    {
      args: [page, perPage]
    }
  );
  const popular = results.map(anime => ({
    ...anime,
    source
  }));
  const animes = [...(popularAnimes.get(source.id) ?? []), ...popular].filter(
    (anime, index, self) =>
      index === self.findIndex(({ id }) => id === anime.id)
  );
  popularAnimes.set(source.id, animes);
  return popular;
}

export async function fetchAnime(id: string, source: Provider): Promise<Anime> {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchAnimeInfo)
    throw error(500, 'Source script not found');

  const { isSubtitles, filler } = get(settings);
  const res: Anime = await safeEval<Anime>(userSource.scripts.fetchAnimeInfo, {
    args: [id, isSubtitles, filler]
  });

  if (res) {
    const anime = {
      ...res,
      recommendations: (res.recommendations ?? []).map(r => ({
        ...r,
        source
      })),
      relations: (res.relations ?? []).map(r => ({
        ...r,
        source
      })),
      source
    };

    animeCache.set(`${source.id}/${id}`, anime);

    const sub = get(subscriptions)[`${anime.source.id}/${anime.id}`];
    const unwatched = get(unwatchedSubscriptions)[
      `${anime.source.id}/${anime.id}`
    ];
    if (sub) {
      if (sub.episodes.length < anime.episodes.length) {
        subscriptions.remove(anime);
        unwatchedSubscriptions.add(
          anime,
          anime.episodes.length - sub.episodes.length
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
    } else if (unwatched) {
      if (unwatched.episodes.length < anime.episodes.length)
        unwatchedSubscriptions.add(
          anime,
          anime.episodes.length -
            unwatched.episodes.length +
            unwatched.newEpisodes
        );
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
    throw error(404, 'Anime not found');
  }
}

export async function fetchEpisode(id: string, source: Provider) {
  const userSource = get(providers)[source.id];

  if (!userSource?.scripts?.fetchEpisodes)
    throw error(500, 'Source script not found');

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
    throw error(404, 'Episode not found');
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

  if (!userSource?.scripts?.search) throw error(500, 'Source script not found');

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
      if (evt.data.error) reject(new Error(evt.data.error));
      else resolve(evt.data);
    };

    worker.onerror = evt => {
      worker.terminate();
      reject(new Error(evt.message));
    };

    worker.postMessage([code, ...(settings?.args ?? [])]);

    setTimeout(
      () => {
        worker.terminate();
        reject(new Error('The worker timed out.'));
      },
      settings?.timeout ?? timeout
    );
  });
}
