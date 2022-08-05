import { writable } from "svelte/store";

/**
 * Record of all of the 3rd party extensions.
 */
export const connections = writable<Record<string, string>>({});
