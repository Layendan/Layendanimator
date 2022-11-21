import { writable } from "svelte/store";
import type { Anime } from "./anime";

export interface History {
  search: string[];
  browse: Anime[];
}

/**
 * History store for what animes have been searched and browsed.
 */
export const history = writable<History>({
  search:
    (JSON.parse(
      window.localStorage.getItem("history/search") ?? "null"
    ) as string[]) ?? [],
  browse:
    (JSON.parse(
      window.localStorage.getItem("history/browse") ?? "null"
    ) as Anime[]) ?? [],
});

history.subscribe((item) => {
  window.localStorage.setItem(`history/search`, JSON.stringify(item.search));
  window.localStorage.setItem(`history/browse`, JSON.stringify(item.browse));
});
