import { writable } from "svelte/store";
import type { Anime } from "./anime";

export interface Library {
  recent: Anime[];
  subscribed: Anime[];
  downloads: { anime: Anime; path: string }[];
}

export const library = writable<Library>({
  recent: [],
  subscribed: [],
  downloads: [],
});
