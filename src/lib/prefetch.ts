import animeSearch from "$lib/GraphQL/animeSearch";
import { invoke } from "@tauri-apps/api/tauri";

export async function getAnimes(titles: string[]): Promise<any> {
  let animes = [];
  for (const element of titles) {
    let anime = searchAnime(element);
    animes = [...animes, { title: element, data: anime }];
  }

  // Calls the close splashscreen api function from rust
  invoke("close_splashscreen");

  return animes;
}

export async function searchAnime(name: string): Promise<Array<any>> {
  // Use try-catch in case window is not defined
  try {
    if (window.sessionStorage.getItem(name + "-search") != null) {
      return JSON.parse(window.sessionStorage.getItem(name + "-search"));
    }
  } catch (error) {
    console.error(error);
  }

  // Define our query variables and values that will be used in the query request
  var variables = {
    search: name,
    page: 1,
    perPage: 15,
  };

  // Define the config we'll need for our Api request
  var url = "https://graphql.anilist.co",
    options;

  // if (access_token) {
  //   options = {
  //     method: "POST",
  //     headers: {
  //       Authorization: "Bearer " + access_token,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //     body: JSON.stringify({
  //       query: animeSearch,
  //       variables: variables,
  //     }),
  //   };
  // } else {
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: animeSearch,
      variables: variables,
    }),
  };
  // }

  let response = await fetch(url, options);
  if (response.status == 429) {
    console.error("Too many requests");
    console.log("Retry after: ", response.headers.get("retry-after"));
    return [];
  }
  let animes = await response.json();

  // Use try-catch in case window is not defined
  try {
    window.sessionStorage.setItem(
      name + "-search",
      JSON.stringify(animes.data.Page.media)
    );
  } catch (error) {
    console.error(error);
  }

  invoke("search_anime", { name: name });

  return animes.data.Page.media;
}
