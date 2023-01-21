type Status = 'Ongoing' | 'Finished' | 'Not yet aired' | 'Cancelled' | 'Hiatus';

type Type = 'MOVIE' | 'TV' | 'OVA' | 'SPECIAL' | 'ONA' | 'MUSIC';

export type Anime = {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  episodeNumber: number | null;
  malId: number;
  synonyms: [string];
  isLicensed: true;
  isAdult: true;
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
    year: number;
    month: number;
    day: number;
  };
  totalEpisodes: number;
  rating: number;
  duration: number;
  genres: [string];
  season: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  studios: [string];
  subOrDub: 'sub' | 'dub';
  type: Type;
  recommendations: [
    {
      id: number;
      malId: number;
      title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
      };
      status: Status;
      episodes: number;
      image: string;
      cover: string;
      rating: number;
      type: 'MOVIE';
    }
  ];
  characters: [
    {
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
    }
  ];
  relations: [
    {
      id: number;
      relationType:
        | 'ADAPTATION'
        | 'PREQUEL'
        | 'SEQUEL'
        | 'PARENT'
        | 'SIDE STORY'
        | 'CHARACTER'
        | 'SUMMARY'
        | 'ALTERNATIVE'
        | 'SPIN OFF'
        | 'OTHER'
        | 'SOURCE'
        | 'COMPILATION'
        | 'CONTAINS';
      malId: number;
      title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
      };
      status: Status;
      episodes: number;
      image: string;
      color: string;
      type: Type;
      rating: number;
    }
  ];
  episodes: [
    {
      id: string;
      title: string;
      description: string;
      number: number;
      image: string;
    }
  ];
};
