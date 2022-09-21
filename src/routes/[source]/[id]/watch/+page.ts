import { get } from "svelte/store";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Mirror } from "$lib/model/anime";
import { activeSources, type ActiveSource } from "$lib/model/sources";

export const ssr = false;

export const load: PageLoad = async ({ url, params, parent }) => {
  const { episode, episodes, title } = await parent();

  const source: ActiveSource | undefined = get(activeSources).find(
    (s) => s.id === params.source
  );
  if (!source) throw error(400, "Source not found");

  const autoplay: boolean = url.searchParams.get("autoplay") === "true";

  const mirrors: Promise<Mirror[]> = new Promise<Mirror[]>(
    (resolve, reject) => {
      if (episode.mirrors) {
        resolve(episode.mirrors);
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.sandbox.add("allow-scripts", "allow-same-origin");
      iframe.srcdoc = `<script type="text/javascript" src="${source.srcPath}"></script>`;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.onload = async () => {
        // @ts-ignore
        const data: Mirror[] = await iframe?.contentWindow?.getStreamingLinks?.(
          episode.id
        );
        iframe.remove();
        episode.mirrors = data;
        data === undefined ? reject("Could not get mirrors") : resolve(data);
      };
    }
  );

  const nextEpisode = episodes.find((e) => e.number === episode.number + 1);

  return {
    source: source,
    id: params.id,
    episode: episode,
    nextEpisode: nextEpisode,
    autoplay: autoplay,
    mirrors: mirrors,
    title: title,
  };
};
