import { writable, readable } from "svelte/store";

export type Mirror = {
  url: string;
  name: string;
  downloadLink: string;
  quality?: string;
  isM3U8?: boolean;
};

/**
 * Represents an Episode of an anime.
 */
export type Episode = {
  title: string;
  id: string;
  number: number;
  thumbnail: string;
  mirrors: Mirror[] | undefined;
  subOrDub: "sub" | "dub";
  site: string;
  description: string;
  /**
   * Number between 0-100, used for percentage of completion.
   */
  percentWatched?: number;
  /**
   * Duration of episode in seconds.
   */
  duration?: number;
};

/**
 * Represents an Anilist Anime.
 * Note: Might be used later for actual anime
 */
export type Anime = {
  id: string;
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
  const { subscribe, set, update } = writable<Map<string, Anime>>(
    new Map<string, Anime>()
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
    removeAnime: (id: string) => {
      update((animes) => {
        animes.delete(id);
        return animes;
      });
    },
    reset: () => set(new Map<string, Anime>()),
  };
}

export const animes = createAnimes();

/**
 * Represents the default Anime.
 */
export const defaultAnime = readable<Anime>({
  id: "",
  title: { english: "", native: "", romaji: "" },
  coverImage: { large: "" },
  bannerImage: "",
  siteUrl: "",
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
