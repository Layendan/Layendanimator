import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/classes/Anime';
import { source } from '$lib/model/source';
import { animeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import { redirect, error } from '@sveltejs/kit';
import { watched } from '$lib/model/watch';
import {
  subscriptions,
  unwatchedSubscriptions
} from '$lib/model/subscriptions';

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
        throw error(404, 'Anime not found');
      }
      return r.json();
    })
    .catch(e => {
      console.error(e);
      throw error(404, 'Anime not found');
    });

  if (anime) {
    anime = {
      ...anime,
      episodes: anime.episodes.sort((a, b) => a.number - b.number)
    };

    animeCache.set(id, anime);
  } else {
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
    const data = get(watched)[params.id];
    throw redirect(
      302,
      `/${params.id}/${
        data?.[data.length - 1].episode.id ?? anime.episodes[0].id
      }`
    );
  }

  return anime;
}) satisfies PageLoad;
