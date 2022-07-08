import { writable } from "svelte/store";

export type Episode = {
  title: string;
  thumbnail: string;
  url: string;
  site: string;
  /**
   * Number between 0-100, used for percentage of completion
   */
  percentWatched?: number;
};

export type Anime = {
  id: number;
  title: {
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
    addAnime: (anime: Anime) => {
      update((animes) => {
        animes.set(anime.id, anime);
        return animes;
      });
    },
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
