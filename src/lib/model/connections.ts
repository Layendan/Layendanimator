import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';

let store: Store | undefined = undefined;

function createConnections() {
  const dict: { [key: string]: string } = {};
  const { subscribe, set, update } = writable(dict);
  return {
    subscribe,
    set: (map: { [key: string]: string }) => {
      set(map);
      store?.set('connections', map);
    },
    add: (key: string, data: string) => {
      update(map => {
        map[key] = data;
        store?.set('connections', map);
        return map;
      });
    },
    remove: (key: string) => {
      update(map => {
        delete map[key];
        store?.set('connections', map);
        return map;
      });
    },
    clear: () => {
      set({});
      store?.set('connections', {});
    },
    initialize: async () => {
      store ??= new Store('.connections.dat');
      const data = await store.get<{ [key: string]: string }>('connections');
      if (data) {
        set(data);
      } else {
        await store.set('connections', {});
      }
    }
  };
}

export const connections = createConnections();
