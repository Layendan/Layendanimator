import { get } from "svelte/store";
import { animes, type Anime, type Episode } from "$lib/model/anime";
import { getAnimeById } from "$lib/prefetch";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const ssr = false;

async function getAnime(id: string): Promise<Anime> {
  return get(animes).get(id) ?? (await getAnimeById(parseInt(id), undefined));
}

export const load: PageLoad = ({ url, params }) => {
  const id = params.id;
  let episode: Episode;

  const param = url.searchParams.get("episode");
  if (!param) {
    throw error(400, "Missing episode parameter");
  }
  episode = JSON.parse(param);

  if (!episode || Number.isNaN(id)) throw error(400, "Invalid parameters");

  return {
    id: id,
    anime: getAnime(id),
    episode: episode,
  };
};
