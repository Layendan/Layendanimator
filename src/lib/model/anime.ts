import { writable, readable } from "svelte/store";

/**
 * Represents an Episode of an anime.
 */
export type Episode = {
  title: string;
  thumbnail: string;
  url: string;
  site: string;
  /**
   * Number between 0-100, used for percentage of completion.
   */
  percentWatched?: number;
};

/**
 * Represents an Anilist Anime.
 * Note: Might be used later for actual anime
 */
export type Anime = {
  id: number;
  title: {
    native: string;
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
  };
  bannerImage: string;
  siteUrl: string;
  description: string;
  streamingEpisodes: Episode[];
  averageScore: number;
  meanScore: number;
  tags: {
    name: string;
  }[];
  genres: string[];
  isAdult: boolean;
};

function createAnimes() {
  const { subscribe, set, update } = writable<Map<number, Anime>>(
    new Map<number, Anime>()
  );

  return {
    subscribe,
    /**
     * Adds an Anime to the animes store.
     * @param anime Anime to add.
     */
    addAnime: (anime: Anime) => {
      update((animes) => {
        animes.set(anime.id, anime);
        return animes;
      });
    },
    /**
     * Removes an Anime from the animes store.
     * @param id Id of the Anime to remove.
     */
    removeAnime: (id: number) => {
      update((animes) => {
        animes.delete(id);
        return animes;
      });
    },
    reset: () => set(new Map<number, Anime>()),
  };
}

export const animes = createAnimes();

/**
 * Represents the default Anime.
 */
export const defaultAnime = readable<Anime>({
  id: undefined,
  title: { english: "", native: "", romaji: "" },
  coverImage: { large: undefined },
  bannerImage: undefined,
  siteUrl: undefined,
  description: "",
  streamingEpisodes: [],
  averageScore: 0,
  meanScore: 0,
  tags: [],
  genres: [],
  isAdult: false,
});

export interface frontPage {
  airing: {
    title: string;
    data: { airingAt: number; episode: number; media: Anime }[];
  };
  recommended: {
    title: string;
    data: Anime[];
  };
  season: {
    title: string;
    data: Anime[];
  };
  trending: {
    title: string;
    data: Anime[];
  };
}
