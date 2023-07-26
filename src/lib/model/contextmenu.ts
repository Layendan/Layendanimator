import { writable } from 'svelte/store';

export const currentContextMenu = writable<string | undefined>(undefined);
