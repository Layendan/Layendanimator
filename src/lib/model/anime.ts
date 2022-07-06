export type Episode = {
  title: string;
  thumbnail: string;
  url: string;
  site: URL;
};

export type Anime = {
  id: number;
  title: {
    romanji: string;
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
