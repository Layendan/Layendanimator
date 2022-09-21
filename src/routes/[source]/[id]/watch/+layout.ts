import { get } from "svelte/store";
import { animes, type Anime, type Episode } from "$lib/model/anime";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { settings } from "$lib/model/settings";

export const ssr = false;

export const load: LayoutLoad = ({ url, params }) => {
  const param: number = parseInt(url.searchParams.get("episode") ?? "");
  if (param === undefined) throw error(400, "Missing episode parameter");

  const anime: Anime | undefined = get(animes).get(params.id);
  if (!anime) throw error(400, "Anime not found");

  const episode: Episode | undefined = anime.streamingEpisodes.find((item) => {
    return item.number === param;
  });
  if (!episode) throw error(400, "Episode not found");

  return {
    showProgress: get(settings).showProgress,
    episode: episode,
    episodes: anime.streamingEpisodes,
    title: anime.title,
  };
};
