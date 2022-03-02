import animeSearch from "$lib/GraphQL/animeSearch";
// import { invoke } from "@tauri-apps/api/tauri";

export async function getAnimes(titles: string[]): Promise<any> {
  let animes = [];
  for await (const element of titles) {
    let anime = await searchAnime(element);
    animes = [...animes, { title: element, data: anime }];
  }

  return animes;
}

async function searchAnime(name: string): Promise<Array<any>> {
  console.log("Starting getAnimes function...");

  try {
    if (window.sessionStorage.getItem(name + "-search") != null) {
      return JSON.parse(window.sessionStorage.getItem(name + "-search"));
    }
  } catch (error) {
    console.error(error);
  }

  console.log("Searching for animes with name: " + name);

  // Define our query variables and values that will be used in the query request
  var variables = {
    search: name,
    page: 1,
    perPage: 15,
    isAdult: false,
  };

  // Define the config we'll need for our Api request
  var url = "https://graphql.anilist.co",
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

  let response = await fetch(url, options);
  let animes = await response.json();
  console.log(response);
  console.log(animes);
  try {
    window.sessionStorage.setItem(
      name + "-search",
      JSON.stringify(animes.data.Page.media)
    );
  } catch (error) {
    console.error(error);
  }

  try {
    const invoke = window.__TAURI__.invoke;

    // invoke("my_custom_command");

    invoke("search_anime", { name: name });
  } catch (e) {
    console.log("Window is not injected");
  }

  return animes.data.Page.media;
}
