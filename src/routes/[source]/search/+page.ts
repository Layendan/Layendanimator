import { get } from "svelte/store";
import { activeSources, type ActiveSource } from "$lib/model/sources";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Anime } from "$lib/model/anime";

export const ssr = false;

export const load: PageLoad = ({ params, url }) => {
  const source: ActiveSource | undefined = get(activeSources).find(
    (item) => item.id === params.source
  );
  if (!source) throw error(400, "Invalid source");

  const query: string | null = url.searchParams.get("search");
  if (!query) throw error(400, "Invalid query");

  const search: Promise<Anime[]> = new Promise<Anime[]>((resolve, reject) => {
    const storage = JSON.parse(
      window?.sessionStorage.getItem(`${query}-search`) ?? "null"
    );
    if (storage) {
      resolve(storage);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts", "allow-same-origin");
    iframe.srcdoc = `<script type="text/javascript" src="${source.srcPath}"></script>`;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.onload = async () => {
      // @ts-ignore
      const data: Anime[] = await iframe?.contentWindow?.searchAnime?.(query);
      iframe.remove();
      window?.sessionStorage.setItem(`${query}-search`, JSON.stringify(data));
      data === undefined ? reject("Could not get mirrors") : resolve(data);
    };
  });

  return {
    source: source,
    query: query,
    search: {
      data: search,
    },
  };
};
