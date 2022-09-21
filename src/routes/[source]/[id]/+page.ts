import { get } from "svelte/store";
import { activeSources, type ActiveSource } from "$lib/model/sources";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { animes, type Anime } from "$lib/model/anime";
import { getIframe } from "$lib/model/global";

export const ssr = false;

export const load: PageLoad = ({ params }) => {
  const source: ActiveSource | undefined = get(activeSources).find(
    (item) => item.id === params.source
  );
  if (!source) throw error(400, "Invalid source");

  const anime: Promise<Anime> = new Promise<Anime>((resolve, reject) => {
    const store = get(animes).get(params.id);
    if (store) {
      resolve(store);
      return;
    }

    const iframe = getIframe(source.srcPath);
    iframe.onload = () => {
      const callback = (
        event: MessageEvent<{ response: string; data: Anime }>
      ) => {
        if (event.data.response === "getAnime") {
          animes.addAnime(event.data.data);
          event.data.data === undefined
            ? reject("Could not get anime")
            : resolve(event.data.data);
        }
        iframe.remove();
        window.removeEventListener("message", callback);
      };
      window.addEventListener("message", callback);

      iframe.contentWindow?.postMessage(
        { command: "getAnime", id: params.id },
        "*"
      );
    };
  });

  return {
    source: source,
    id: params.id,
    anime: anime,
  };
};
