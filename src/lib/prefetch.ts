import animeSearch from "$lib/GraphQL/animeSearch";
import { invoke } from "@tauri-apps/api/tauri";
import type { Anime } from "./model/anime";
import { Body, fetch, type HttpOptions } from "@tauri-apps/api/http";

export function getAnimes(
  titles: string[],
  token: string | undefined
): { title: string; data: Promise<Anime[]> }[] {
  let animes = [];
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
  if (window?.sessionStorage.getItem(name + "-search") != null) {
    return JSON.parse(window?.sessionStorage.getItem(name + "-search"));
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
  if (response.status == 429) {
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
