import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/classes/Anime';
import { source } from '$lib/model/source';
import { animeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import { redirect, error } from '@sveltejs/kit';
import { watching } from '$lib/model/watch';
import {
  subscriptions,
  unwatchedSubscriptions
} from '$lib/model/subscriptions';
import { notifications } from '$lib/model/notifications';

async function fetchAnime(id: string, _fetch: typeof fetch): Promise<Anime> {
  let anime: Anime = await _fetch(
    `https://consumet.app.jet-black.xyz/meta/anilist/info/${id}?provider=${
      get(source).id
    }`,
    { signal: AbortSignal.timeout(15000) }
  )
    .then(r => {
      if (r.status !== 200) {
        console.error(r);
        notifications.addNotification({
          title: 'Anime not found',
          message: `The anime with id ${id} was not found.`,
          type: 'error'
        });
        throw error(404, 'Anime not found');
      }
      return r.json();
    })
    .catch(e => {
      console.error(e);
      notifications.addNotification({
        title: 'Anime not found',
        message: `The anime with id ${id} was not found.`,
        type: 'error'
      });
      throw error(404, 'Anime not found');
    });

  if (anime) {
    anime = {
      ...anime,
      episodes: anime.episodes.sort((a, b) => a.number - b.number)
    };

    animeCache.set(id, anime);
  } else {
    notifications.addNotification({
      title: 'Anime not found',
      message: `The anime with id ${id} was not found.`,
      type: 'error'
    });
    throw error(404, 'Anime not found');
  }

  return anime;
}

export const load = (async ({ fetch, depends, params, url }) => {
  depends(params.id);

  const anime =
    animeCache.get(params.id) ?? (await fetchAnime(params.id, fetch));

  const temp = get(subscriptions)[anime.id];
  const sub = temp
    ? {
        ...temp,
        newEpisodes: 0
      }
    : get(unwatchedSubscriptions)[anime.id];
  if (sub && sub.episodes.length < anime.episodes.length) {
    subscriptions.remove(anime);
    unwatchedSubscriptions.add(
      anime,
      anime.episodes.length - sub.episodes.length + sub.newEpisodes
    );
  }

  if (url.searchParams.get('autoplay') === 'true') {
    const data = get(watching)[params.id];
    const watchPercentage = 0.8;
    const hasLastEpisode = data?.watchEpisode?.id === anime.episodes.at(-1)?.id;
    const lastEpisodeFinished =
      !!anime.episodes.at(-1) &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (data?.watchedEpisodes[anime.episodes.at(-1)!.id]?.percentage ?? 0) >=
        watchPercentage;
    const href = `/${params.id}/${
      hasLastEpisode && lastEpisodeFinished
        ? anime.episodes[0].id
        : data?.watchEpisode?.id ?? anime.episodes[0].id
    }`;

    throw redirect(302, href);
  }

  return anime;
}) satisfies PageLoad;
