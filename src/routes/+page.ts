import { frontpageFetch } from "$lib/prefetch";
import { get } from "svelte/store";
import { connections } from "$lib/model/connections";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
  const date: Date = new Date();
  let season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  switch (date.getMonth()) {
    case 0:
    case 1:
    case 2:
      season = "WINTER";
      break;
    case 3:
    case 4:
    case 5:
      season = "SPRING";
      break;
    case 6:
    case 7:
    case 8:
      season = "SUMMER";
      break;
    case 9:
    case 10:
    case 11:
      season = "FALL";
      break;
  }

  return {
    date: date,
    season: season,
    list: frontpageFetch(
      season,
      date.getFullYear(),
      get(connections)["anilist"]
    ),
  };
};
