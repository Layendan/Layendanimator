import { writable } from "svelte/store";
import type { Anime } from "./anime";

export interface History {
  search: string[];
  browse: Anime[];
}

export const defaultHistory: History = {
  search: [],
  browse: [],
};

export const history = writable<History>(defaultHistory);
