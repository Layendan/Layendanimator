import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';
import { source } from '$lib/model/source';
import { animeCache } from '$lib/model/cache';
import { get } from 'svelte/store';
import {
  subscriptions,
  unwatchedSubscriptions
} from '$lib/model/subscriptions';

export const load = (async ({ fetch, depends, params }) => {
  depends(params.id);

  const anime = animeCache.get(params.id);
  // TODO: Create store for episodes
  const episodes: Record<
    string,
    {
      watched: number;
      duration: number;
      lastWatched: string;
    }
  > = {};

  if (anime) {
    return {
      anime: anime,
      store: episodes
    };
  } else {
    const anime: Anime = await fetch(
      `https://consumet.app.jet-black.xyz/meta/anilist/info/${
        params.id
      }?provider=${get(source).id}`,
      { signal: AbortSignal.timeout(15000) }
    ).then(r => r.json());

    if (anime) {
      animeCache.set(params.id, anime);
    }

    const temp = get(subscriptions).find(({ id }) => id === anime.id);
    const sub = temp
      ? {
          anime: temp,
          newEpisodes: 0
        }
      : get(unwatchedSubscriptions).find(
          ({ anime: { id } }) => id === anime.id
        );
    if (sub && sub.anime.episodes.length < anime.episodes.length) {
      subscriptions.remove(anime);
      unwatchedSubscriptions.add({
        anime: anime,
        newEpisodes:
          anime.episodes.length - sub.anime.episodes.length + sub.newEpisodes
      });
    }

    return {
      anime: anime,
      store: episodes
    };
  }
}) satisfies PageLoad;
