import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';
import type { Anime } from './Anime';

async function createSubscriptions() {
  const { subscribe, set } = writable<Anime[]>(
    (await new Store('.subscriptions.dat').get<Anime[]>('subscriptions')) ?? []
  );
  return {
    subscribe,
    set: async (subscriptions: Anime[]) => {
      set(subscriptions);
      await new Store('.subscriptions.dat').set('subscriptions', subscriptions);
    },
    add: async (anime: Anime) => {
      const subscriptions = await new Store('.subscriptions.dat').get<Anime[]>(
        'subscriptions'
      );
      const result = [
        anime,
        ...(subscriptions?.filter(a => a.id !== anime.id) ?? [])
      ];
      set(result);
      await new Store('.subscriptions.dat').set('subscriptions', result);
    },
    remove: async (anime: Anime) => {
      const subscriptions = await new Store('.subscriptions.dat').get<Anime[]>(
        'subscriptions'
      );
      const result = subscriptions?.filter(a => a.id !== anime.id) ?? [];
      set(result);
      await new Store('.subscriptions.dat').set('subscriptions', result);
    }
  };
}

export const subscriptions = await createSubscriptions();

async function createUnwatchedSubscriptions() {
  const { subscribe, set } = writable<{ anime: Anime; newEpisodes: number }[]>(
    (await new Store('.subscriptions.dat').get<
      { anime: Anime; newEpisodes: number }[]
    >('activeSubscriptions')) ?? []
  );
  return {
    subscribe,
    set: async (subscriptions: { anime: Anime; newEpisodes: number }[]) => {
      set(subscriptions);
      await new Store('.subscriptions.dat').set(
        'activeSubscriptions',
        subscriptions
      );
    },
    add: async (anime: { anime: Anime; newEpisodes: number }) => {
      const subscriptions = await new Store('.subscriptions.dat').get<
        { anime: Anime; newEpisodes: number }[]
      >('activeSubscriptions');
      const result = [
        anime,
        ...(subscriptions?.filter(a => a.anime.id !== anime.anime.id) ?? [])
      ];
      set(result);
      await new Store('.subscriptions.dat').set('activeSubscriptions', result);
    },
    remove: async (anime: { anime: Anime; newEpisodes: number }) => {
      const subscriptions = await new Store('.subscriptions.dat').get<
        { anime: Anime; newEpisodes: number }[]
      >('activeSubscriptions');
      const result =
        subscriptions?.filter(a => a.anime.id !== anime.anime.id) ?? [];
      set(result);
      await new Store('.subscriptions.dat').set('activeSubscriptions', result);
    }
  };
}

export const unwatchedSubscriptions = await createUnwatchedSubscriptions();
