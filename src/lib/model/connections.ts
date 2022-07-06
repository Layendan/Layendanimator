import { writable } from "svelte/store";

export const connections = writable<Record<string, string>>({});
