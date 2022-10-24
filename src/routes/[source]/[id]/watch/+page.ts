import { get } from "svelte/store";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { Episode, Mirror } from "$lib/model/anime";
import { activeSources, type ActiveSource } from "$lib/model/sources";

export const ssr = false;

export const load: PageLoad = async ({ url, params, parent, depends }) => {
  const { episode, episodes } = await parent();

  const source: ActiveSource | undefined = get(activeSources).find(
    (s) => s.id === params.source
  );
  if (!source) throw error(400, "Source not found");

  depends(source.id, `${episode.id}/mirrors`);

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
        try {
          const data: Mirror[] =
            // @ts-ignore
            await iframe?.contentWindow?.getStreamingLinks?.(episode.id);
          episode.mirrors = data;
          data === undefined ? reject("Could not get mirrors") : resolve(data);
        } catch (e) {
          reject(`Could not get mirrors: ${e}`);
        } finally {
          iframe.remove();
        }
      };
    }
  );

  const nextEpisode: Episode | undefined = episodes.find(
    (e) => e.number === episode.number + 1
  );

  return {
    source: source,
    id: params.id,
    nextEpisode: nextEpisode,
    autoplay: autoplay,
    mirrors: {
      data: mirrors,
    },
  };
};
