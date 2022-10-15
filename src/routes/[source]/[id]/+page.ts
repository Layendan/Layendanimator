import { get } from "svelte/store";
import { activeSources, type ActiveSource } from "$lib/model/sources";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { animes, type Anime } from "$lib/model/anime";

export const ssr = false;

export const load: PageLoad = ({ params, depends }) => {
  const source: ActiveSource | undefined = get(activeSources).find(
    (item) => item.id === params.source
  );
  if (!source) throw error(400, "Invalid source");

  depends(source.id, `${source.id}/${params.id}`);

  const anime: Promise<Anime> = new Promise<Anime>((resolve, reject) => {
    const store = get(animes).get(params.id);
    if (store) {
      resolve(store);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts", "allow-same-origin");
    iframe.srcdoc = `<script type="text/javascript" src="${source.srcPath}"></script>`;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.onload = async () => {
      try {
        const anime: Anime =
          // @ts-ignore
          await iframe?.contentWindow?.getAnime?.(params.id);
        iframe.remove();
        anime === undefined
          ? reject("Could not get Anime info")
          : resolve(anime);
        animes.addAnime(anime);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    };
  });

  return {
    source: source,
    id: params.id,
    anime: {
      data: anime,
    },
  };
};
