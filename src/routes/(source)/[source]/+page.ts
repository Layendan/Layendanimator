import type { PageLoad } from "./$types";
import type { Anime } from "$lib/model/anime";

export const ssr = false;

export const load: PageLoad = async ({ depends, parent }) => {
  const { source } = await parent();

  // TODO: use fetch instead
  depends(source.id);

  const recentEpisodes: Promise<{ episode: number; media: Anime }[]> =
    new Promise<{ episode: number; media: Anime }[]>((resolve, reject) => {
      const data: {
        expiration: number;
        data: { episode: number; media: Anime }[];
      } = JSON.parse(
        window.sessionStorage.getItem(`${source.id}-recent-episodes`) ?? "null"
      );
      if (data && data.expiration > Date.now()) {
        resolve(data.data);
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.sandbox.add("allow-scripts", "allow-same-origin");
      iframe.srcdoc = `<script type="text/javascript" src="${source.srcPath}"></script>`;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.onload = async () => {
        try {
          const recentEpisodes: { episode: number; media: Anime }[] =
            // @ts-ignore
            await iframe?.contentWindow?.getRecentEpisodes?.();
          recentEpisodes === undefined
            ? reject("Could not get Recent Episodes")
            : resolve(recentEpisodes);
          const date: Date = new Date();
          window.sessionStorage.setItem(
            `${source.id}-recent-episodes`,
            JSON.stringify({
              expiration: date.setMinutes(date.getMinutes() + 30).valueOf(),
              data: recentEpisodes,
            })
          );
        } catch (e) {
          console.error(e);
          if (data) resolve(data.data);
          else reject(e);
        } finally {
          iframe.remove();
        }
      };
    });

  const topAiring: Promise<Anime[]> = new Promise<Anime[]>(
    (resolve, reject) => {
      const data: { expiration: number; data: Anime[] } = JSON.parse(
        window.sessionStorage.getItem(`${source.id}-top-airing`) ?? "null"
      );
      if (data && data.expiration > Date.now()) {
        resolve(data.data);
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.sandbox.add("allow-scripts", "allow-same-origin");
      iframe.srcdoc = `<script type="text/javascript" src="${source.srcPath}"></script>`;
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      iframe.onload = async () => {
        try {
          const topAiring: Anime[] =
            // @ts-ignore
            await iframe?.contentWindow?.getTopAiring?.();
          topAiring === undefined
            ? reject("Could not get Top Airing")
            : resolve(topAiring);
          const date: Date = new Date();
          window.sessionStorage.setItem(
            `${source.id}-top-airing`,
            JSON.stringify({
              expiring: date.setMinutes(date.getMinutes() + 30).valueOf(),
              data: topAiring,
            })
          );
        } catch (e) {
          console.error(e);
          if (data) resolve(data.data);
          else reject(e);
        } finally {
          iframe.remove();
        }
      };
    }
  );

  const popular: Promise<Anime[]> = new Promise<Anime[]>((resolve, reject) => {
    const data: { expiration: number; data: Anime[] } = JSON.parse(
      window.sessionStorage.getItem(`${source.id}-popular`) ?? "null"
    );
    if (data && data.expiration > Date.now()) {
      resolve(data.data);
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts", "allow-same-origin");
    iframe.srcdoc = `<script type="text/javascript" src="${source.srcPath}"></script>`;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.onload = async () => {
      try {
        const popular: Anime[] =
          // @ts-ignore
          await iframe?.contentWindow?.getPopular?.();
        popular === undefined
          ? reject("Could not get Popular Animes")
          : resolve(popular);
        const date: Date = new Date();
        window.sessionStorage.setItem(
          `${source.id}-popular`,
          JSON.stringify({
            expiring: date.setMinutes(date.getMinutes() + 30).valueOf(),
            data: popular,
          })
        );
      } catch (e) {
        console.error(e);
        if (data) resolve(data.data);
        else reject(e);
      } finally {
        iframe.remove();
      }
    };
  });

  return {
    source: source,
    recentEpisodes: {
      data: recentEpisodes,
    },
    topAiring: {
      data: topAiring,
    },
    popular: {
      data: popular,
    },
  };
};
