import { writable } from "svelte/store";
import type { Anime } from "./anime";

export interface History {
  search: string[];
  browse: Anime[];
}

/**
 * History store for what animes have been searched and browsed.
 */
export const history = writable<History>({ search: [], browse: [] });
