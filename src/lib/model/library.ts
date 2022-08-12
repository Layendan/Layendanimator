import { writable } from "svelte/store";
import type { Anime } from "./anime";

export interface Library {
  /**
   * Subscribed animes, occasionally check if there are updates.
   */
  subscriptions: Anime[];
  /**
   * Downloaded animes.
   * Note: Might change Anime to SourceAnime or something like that.
   */
  downloads: { anime: Anime; path: string }[];
}

/**
 * Library store used for the Library domain route.
 */
export const library = writable<Library>({
  subscriptions: [],
  downloads: [],
});
