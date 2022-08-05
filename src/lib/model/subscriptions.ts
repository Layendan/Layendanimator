import { writable } from "svelte/store";
import type { Anime } from "./anime";

export type Subscription = {
  anime: Anime;
};

/**
 * List of subscribed animes.
 * Will most likely be replaced by library.subscriptions
 */
export const subscriptions = writable<Subscription[]>([]);
