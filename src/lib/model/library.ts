import { writable } from "svelte/store";
import type { Anime } from "./anime";

export interface Library {
  recent: Anime[];
  subscribed: Anime[];
  downloads: { anime: Anime; location?: string }[];
}

export const defaultLibrary: Library = {
  recent: [],
  subscribed: [],
  downloads: [],
};

export const library = writable<Library>(defaultLibrary);
