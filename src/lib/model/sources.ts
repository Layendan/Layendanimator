import { writable } from "svelte/store";

export interface ActiveSource {
  id: string;
  name: string;
  version: string;
  baseUrl: string;
  srcPath: string;
  contentRating: "EVERYONE" | "MATURE" | "ADULT";
  desc: string;
  tags: { type: "success" | "danger" | "warning"; text: string }[];
  icon: string;
  author: string;
  repo: string;
  website: string;
  mainPage: {
    topAiring: boolean;
    recentEpisodes: boolean;
  };
}

export interface Repository {
  name: string;
  url: string;
}

/**
 * List of all the sources accepted by the user and able to be used in the application.
 */
export const activeSources = writable<ActiveSource[]>([]);
/**
 * List of repositories that contain sources.
 * The url should link to a github repository (might be changed)
 */
export const repositories = writable<Repository[]>([]);
