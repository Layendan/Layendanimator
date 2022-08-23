import { get } from "svelte/store";
import { animes, type Anime, type Episode } from "$lib/model/anime";
import { getAnimeById } from "$lib/prefetch";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

async function getAnime(id: number): Promise<Anime> {
  return get(animes).get(id) ?? (await getAnimeById(id, undefined));
}

export const load: PageLoad = (url) => {
  const id = Number(url.params.id);
  let episode: Episode;

  try {
    episode = JSON.parse(url.url.searchParams.get("episode"));
  } catch (e) {
    throw error(400, e);
  }

  if (!episode || Number.isNaN(id)) throw error(400, "Invalid parameters");

  return {
    id: id,
    anime: getAnime(id),
    episode: episode,
  };
};
