import type { PageLoad } from './$types';
import type { Anime } from '$lib/model/Anime';
import { Store } from 'tauri-plugin-store-api';

export const load = (async ({ fetch, params }) => {
  const anime: Anime = await fetch(
    `https://api.consumet.org/meta/anilist/info/${params.id}`
  ).then(r => r.json());

  const store = new Store('.episodes.dat');
  const episodes =
    (await store.get<
      Record<
        string,
        {
          watched: number;
          duration: number;
          lastWatched: string;
        }
      >
    >(anime.id)) ?? {};
  if (!episodes) {
    await store.set(anime.id, episodes);
  }

  const subscriptions = await new Store('.subscriptions.dat').get<Anime[]>(
    'subscriptions'
  );

  return {
    anime: anime,
    store: episodes,
    subscriptions: subscriptions ?? [],
    isSubscribed: subscriptions?.some(a => a.id === anime.id) ?? false
  };
}) satisfies PageLoad;
