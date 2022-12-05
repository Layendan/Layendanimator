import { writable } from "svelte/store";
import type { Anime } from "./anime";
import type { ActiveSource } from "./sources";

export interface Library {
  /**
   * Subscribed animes, occasionally check if there are updates.
   */
  subscriptions: { media: Anime; source?: ActiveSource }[];
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
  subscriptions:
    (JSON.parse(
      window.localStorage.getItem("library/subscriptions") ?? "null"
    ) as {
      media: Anime;
      source?: ActiveSource;
    }[]) ?? [],
  downloads:
    (JSON.parse(window.localStorage.getItem("library/downloads") ?? "null") as {
      anime: Anime;
      path: string;
    }[]) ?? [],
});

library.subscribe((item) => {
  window.localStorage.setItem(
    `library/subscriptions`,
    JSON.stringify(item.subscriptions)
  );
  window.localStorage.setItem(
    `library/downloads`,
    JSON.stringify(item.downloads)
  );
});
