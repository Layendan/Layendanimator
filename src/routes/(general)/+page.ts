import { get } from "svelte/store";
import { activeSources } from "$lib/model/sources";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const ssr = false;

export const load: PageLoad = ({ depends }) => {
  depends("na:/");
  if (get(activeSources).length > 0)
    throw redirect(307, `/${get(activeSources)[0].id}`);
};
