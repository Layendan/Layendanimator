export type Anime = {
  id: 'string';
  title: {
    romaji: 'string';
    english: 'string';
    native: 'string';
  };
  malId: 0;
  synonyms: ['string'];
  isLicensed: true;
  isAdult: true;
  countryOfOrigin: 'string';
  trailer: {
    id: 'string';
    site: 'string';
    thumbnail: 'string';
  };
  image: 'string';
  popularity: 0;
  color: 'string';
  cover: 'string';
  description: 'string';
  status: 'Ongoing';
  releaseDate: 'string';
  startDate: {
    year: 0;
    month: 0;
    day: 0;
  };
  endDate: {
    year: 0;
    month: 0;
    day: 0;
  };
  nextAiringEpisode: {
    year: 0;
    month: 0;
    day: 0;
  };
  totalEpisodes: 0;
  rating: 0;
  duration: 0;
  genres: ['string'];
  season: 'WINTER';
  studios: ['string'];
  subOrDub: 'sub';
  type: 'MOVIE';
  recommendations: [
    {
      id: 0;
      malId: 0;
      title: {
        romaji: 'string';
        english: 'string';
        native: 'string';
        userPreferred: 'string';
      };
      status: 'Ongoing';
      episodes: 0;
      image: 'string';
      cover: 'string';
      rating: 0;
      type: 'MOVIE';
    }
  ];
  characters: [
    {
      id: 0;
      role: 'string';
      name: {
        first: 'string';
        last: 'string';
        full: 'string';
        native: 'string';
        userPreferred: 'string';
      };
      image: 'string';
      voiceActors: [
        {
          id: 0;
          name: {
            first: 'string';
            last: 'string';
            full: 'string';
            native: 'string';
            userPreferred: 'string';
          };
          image: 'string';
        }
      ];
    }
  ];
  relations: [
    {
      id: 0;
      relationType: 'ADAPTATION';
      malId: 0;
      title: {
        romaji: 'string';
        english: 'string';
        native: 'string';
        userPreferred: 'string';
      };
      status: 'Ongoing';
      episodes: 0;
      image: 'string';
      color: 'string';
      type: 'MOVIE';
      rating: 0;
    }
  ];
  episodes: [
    {
      id: 'string';
      title: 'string';
      description: 'string';
      number: 0;
      image: 'string';
    }
  ];
};
