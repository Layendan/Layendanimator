import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';

const store = new Store('.library.dat');

function createSearchHistory() {
  const { subscribe, set, update } = writable<string[]>([]);
  return {
    subscribe,
    set: async (items: string[]) => {
      set(items);
      await store?.set('searchHistory', items);
    },
    add: (item: string) => {
      update(items => {
        const result = [item, ...items.filter(i => i !== item)];
        store?.set('searchHistory', result);
        return result;
      });
    },
    remove: (item: string) => {
      update(items => {
        const result = items.filter(i => i !== item);
        store?.set('searchHistory', result);
        return result;
      });
    },
    clear: async () => {
      set([]);
      await store?.set('searchHistory', []);
    },
    initialize: async () => {
      const data = await store.get<string[]>('searchHistory');
      if (data) {
        set(data);
      } else {
        await store.set('searchHistory', []);
      }
    }
  };
}

export const searchHistory = createSearchHistory();
