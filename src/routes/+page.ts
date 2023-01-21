import type { Anime } from '$lib/model/Anime';
import type { PageLoad } from './$types';
import { Store } from 'tauri-plugin-store-api';

export const load = (async ({ fetch }) => {
  return {
    recent: (
      await fetch(
        'https://api.consumet.org/meta/anilist/recent-episodes?perPage=25'
      ).then(r => r.json())
    ).results as Anime[],
    subscriptions:
      (await new Store('.subscriptions.dat').get<Anime[]>('subscriptions')) ??
      [],
    popular: (
      await fetch('https://api.consumet.org/meta/anilist/popular').then(r =>
        r.json()
      )
    ).results as Anime[],
    trending: (
      await fetch(
        'https://api.consumet.org/meta/anilist/trending?perPage=25'
      ).then(r => r.json())
    ).results as Anime[]
  };
}) satisfies PageLoad;
