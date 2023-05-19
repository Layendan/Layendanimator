import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { watched } from '$lib/model/watch';
import {
  subscriptions,
  unwatchedSubscriptions
} from '$lib/model/subscriptions';
import { downloadedAnimes } from '$lib/model/downloads';

export const load = (async ({ depends, params, url }) => {
  depends(`/downloads/${params.id}`);

  const download = get(downloadedAnimes).find(
    download => download.anime.id === params.id
  );

  if (!download) {
    throw redirect(300, '/library');
  }

  const anime = download.anime;

  const temp = get(subscriptions).find(({ id }) => id === anime.id);
  const sub = temp
    ? {
        anime: temp,
        newEpisodes: 0
      }
    : get(unwatchedSubscriptions).find(({ anime: { id } }) => id === anime.id);
  if (sub && sub.anime.episodes.length < anime.episodes.length) {
    subscriptions.remove(anime);
    unwatchedSubscriptions.add({
      anime: anime,
      newEpisodes:
        anime.episodes.length - sub.anime.episodes.length + sub.newEpisodes
    });
  }

  if (url.searchParams.get('autoplay') === 'true') {
    const data = get(watched)[params.id];
    throw redirect(
      302,
      `downloads/${params.id}/${
        data?.[data.length - 1].episode.id ?? anime.episodes[0].id
      }`
    );
  }

  return {
    anime,
    episodes: anime.episodes.filter(episode =>
      download.episodes.find(dEpisode => dEpisode.number === episode.number)
    )
  };
}) satisfies PageLoad;
