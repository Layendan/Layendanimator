import { writable } from "svelte/store";
import type { Anime } from "./anime";

export type Subscription = {
  anime: Anime;
};

export const subscriptions = writable<Subscription[]>([]);
