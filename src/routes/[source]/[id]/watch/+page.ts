import { get } from "svelte/store";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { activeSources, type ActiveSource } from "$lib/model/sources";

export const ssr = false;

export const load: PageLoad = async ({ params, parent }) => {
  const { episode, episodes } = await parent();

  const source: ActiveSource | undefined = get(activeSources).find(
    (s) => s.id === params.source
  );
  if (!source) throw error(400, "Source not found");

  return {
    source: source,
    id: params.id,
    episode: episode,
    episodes: episodes,
  };
};
