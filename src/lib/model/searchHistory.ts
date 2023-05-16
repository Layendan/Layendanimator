import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';

let store: Store | undefined = undefined;

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
    clear: () => {
      set([]);
      store?.set('searchHistory', []);
    },
    initialize: async () => {
      store ??= new Store('.library.dat');
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
