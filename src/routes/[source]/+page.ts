import { get } from "svelte/store";
import { activeSources, type ActiveSource } from "$lib/model/sources";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
  const source: ActiveSource | undefined = get(activeSources).find(
    (item) => item.id === params.source
  );
  if (!source) throw error(400, "Invalid source");

  return {
    source: source,
  };
};