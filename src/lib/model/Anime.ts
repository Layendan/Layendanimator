type Status =
  | 'Ongoing'
  | 'Completed'
  | 'Not yet aired'
  | 'Cancelled'
  | 'Hiatus'
  | 'Unknown';

type Type =
  | 'MOVIE'
  | 'TV'
  | 'OVA'
  | 'SPECIAL'
  | 'ONA'
  | 'MUSIC'
  | 'MANGA'
  | 'NOVEL'
  | 'ONE_SHOT';

export type Anime = {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  episodeNumber: number | null;
  malId: number;
  synonyms: string[];
  isLicensed: boolean;
  isAdult: boolean;
  countryOfOrigin: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
  };
  image: string;
  popularity: number;
  color: string;
  cover: string;
  description: string;
  status: Status;
  releaseDate: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  nextAiringEpisode: {
    airingTime: number;
    timeUntilAiring: number;
    episode: number;
  };
  totalEpisodes: number;
  rating: number;
  duration: number;
  genres: string[];
  season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  studios: string[];
  subOrDub: 'sub' | 'dub';
  type: Type;
  recommendations: Anime[];
  characters: Character[];
  relations: Anime[];
  episodes: Episode[];
};

export type Character = {
  id: number;
  role: string;
  name: {
    first: string;
    last: string;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  voiceActors: [
    {
      id: number;
      name: {
        first: string;
        last: string;
        full: string;
        native: string;
        userPreferred: string;
      };
      image: string;
    }
  ];
};

export type Episode = {
  id: string;
  title: string;
  description: string;
  number: number;
  image: string;
  airDate: string;
};
