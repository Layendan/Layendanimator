import animeSearch, { multipleSearch } from "$lib/GraphQL/animeSearch";
import getAnime from "./GraphQL/getAnime";
import { invoke } from "@tauri-apps/api/tauri";
import {
  animes,
  type Anime,
  type frontPage as frontPageType,
} from "./model/anime";
import { Body, fetch, type HttpOptions } from "@tauri-apps/api/http";
import frontPage from "./GraphQL/frontPage";
import { animes as animesStore } from "$lib/model/anime";

export function getAnimes(
  titles: string[],
  token: string | undefined
): { title: string; data: Promise<Anime[]> }[] {
  let animes: { title: string; data: Promise<Anime[]> }[] = [];
  for (const element of titles) {
    let anime = searchAnime(element, token);
    animes = [...animes, { title: element, data: anime }];
  }

  // Calls the close splashscreen api function from rust
  invoke("close_splashscreen");

  return animes;
}

export async function searchAnime(
  name: string,
  token: string | undefined
): Promise<Anime[]> {
  if (window?.sessionStorage.getItem(name + "-search") !== null) {
    return JSON.parse(
      window?.sessionStorage.getItem(name + "-search") ?? "null"
    );
  }

  // Define our query variables and values that will be used in the query request
  var variables = {
    search: name,
    page: 1,
    perPage: 15,
  };

  // Define the config we'll need for our Api request
  var url: string = "https://graphql.anilist.co",
    options: HttpOptions;

  options = {
    url: url,
    method: "POST",
    headers: token
      ? {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
    body: Body.json({
      query: animeSearch,
      variables: variables,
    }),
  };

  let response = await fetch<{
    data: {
      Page: {
        media: Anime[];
        pageInfo: {
          total: number;
          currentPage: number;
          lastPage: number;
          hasNextPage: boolean;
          perPage: number;
        };
      };
    };
  }>(url, options);
  if (response.status === 429) {
    console.error("Too many requests");
    console.log("Retry after: ", response.headers["retry-after"]);
    throw new Error("Too many requests");
  }
  let animes = await response.data;

  window?.sessionStorage.setItem(
    name + "-search",
    JSON.stringify(animes.data.Page.media)
  );

  invoke("search_anime", { name: name });

  return animes.data.Page.media;
}

export async function getAnimeById(
  id: number,
  token: string | undefined
): Promise<Anime> {
  var variables = {
    id: id,
  };

  // Define the config we'll need for our Api request
  var url: string = "https://graphql.anilist.co",
    options: HttpOptions;

  options = {
    url: url,
    method: "POST",
    headers: token
      ? {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
    body: Body.json({
      query: getAnime,
      variables: variables,
    }),
  };

  let response = await fetch<any>(url, options);
  if (response.status === 429) {
    console.error("Too many requests");
    console.log("Retry after: ", response.headers["retry-after"]);
    throw new Error("Too many requests");
  }
  let anime = await response.data;

  animes.addAnime(anime.data.Media);

  return anime.data.Media;
}

export async function searchAnimes(
  animes: string[],
  token?: string
): Promise<{ title: string; data: Anime[] }[]> {
  // Define the config we'll need for our Api request
  const variables = JSON.parse(
      `{${animes.map((anime) => {
        return `"${anime
          .replaceAll(" ", "_")
          .replaceAll(":", "_")}": "${anime}"`;
      })}}`
    ),
    url: string = "https://graphql.anilist.co",
    options: HttpOptions = {
      url: url,
      method: "POST",
      headers: token
        ? {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      body: Body.json({
        query: multipleSearch(
          animes.map((anime) => {
            return anime.replaceAll(" ", "_").replaceAll(":", "_");
          })
        ),
        variables: variables,
      }),
    };

  console.log(variables);
  invoke("close_splashscreen");

  const response = await fetch<any>(url, options);
  if (response.status === 429) {
    console.error("Too many requests");
    console.log("Retry after: ", response.headers["retry-after"]);
    throw new Error("Too many requests");
  }
  let anime = await response.data;

  console.log(anime.data);

  let sections = [];

  for (let i in anime.data) {
    sections.push({ title: i.replaceAll("_", " "), data: anime.data[i].media });
  }

  console.log(sections);

  return sections;
}

export async function frontpageFetch(
  month: "WINTER" | "SPRING" | "SUMMER" | "FALL",
  year: number,
  token?: string
): Promise<frontPageType> {
  if (window?.sessionStorage.getItem("frontPage") !== null) {
    const response = JSON.parse(
      window?.sessionStorage.getItem("frontPage") ?? "null"
    );
    // Checks to see if data is expired or if offline
    if (
      new Date(response.expires).valueOf() >= Date.now() ||
      !window?.navigator?.onLine
    )
      return response;
  }

  // Define the config we'll need for our Api request
  const variables = {
      perPage: 40,
      season: month,
      year,
    },
    url: string = "https://graphql.anilist.co",
    options: HttpOptions = {
      url: url,
      method: "POST",
      headers: token
        ? {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      body: Body.json({
        query: frontPage,
        variables: variables,
      }),
      timeout: { secs: 30, nanos: 0 },
    };

  let anime;
  try {
    anime = (await fetch<any>(url, options)).data;
  } finally {
    invoke("close_splashscreen");
  }

  let sections = {
    airing: {
      title: "Airing",
      data: anime.data.airing.airingSchedules,
    },
    recommended: {
      title: "Recommended",
      data: (
        anime.data.recommended.recommendations as {
          mediaRecommendation: Anime;
        }[]
      ).map((item) => {
        return item.mediaRecommendation;
      }) as Anime[],
    },
    season: {
      title: "Seasonal Anime",
      data: anime.data.seasonal.media as Anime[],
    },
    trending: { title: "Trending", data: anime.data.trending.media as Anime[] },
  };

  (anime.data.airing.airingSchedules as { media: Anime }[]).forEach((item) => {
    return animesStore.addAnime(item.media);
  });
  (
    anime.data.recommended.recommendations as { mediaRecommendation: Anime }[]
  ).forEach((item) => {
    return animesStore.addAnime(item.mediaRecommendation);
  });
  (anime.data.seasonal.media as Anime[]).forEach((item) => {
    return animesStore.addAnime(item);
  });
  (anime.data.trending.media as Anime[]).forEach((item) => {
    return animesStore.addAnime(item);
  });

  window?.sessionStorage.removeItem(`${sections.airing.title}:scroll`);
  window?.sessionStorage.removeItem(`${sections.recommended.title}:scroll`);
  window?.sessionStorage.removeItem(`${sections.season.title}:scroll`);
  window?.sessionStorage.removeItem(`${sections.trending.title}:scroll`);

  const date = new Date();

  // Maybe I don't need ?. on the other window calls
  window.sessionStorage.setItem(
    "frontPage",
    JSON.stringify({
      ...sections,
      expires: date.setMinutes(date.getMinutes() + 30),
    })
  );

  return sections;
}

export async function getUserId(token: string): Promise<number> {
  // Define the config we'll need for our Api request
  const url: string = "https://graphql.anilist.co",
    options: HttpOptions = {
      url: url,
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: Body.json({
        query: `query {
	Viewer {
		id
	}
}`,
      }),
    };

  const response = await fetch<any>(url, options);
  return response.data.data.Viewer.id;
}
