import { writable } from "svelte/store";

export interface Settings {
  allowNSFW: boolean;
  ordered: boolean;
  notifications: {
    enabled: boolean;
    grouped: boolean;
  };
}

export const settings = writable<Settings>({
  allowNSFW: false,
  ordered: true,
  notifications: { enabled: true, grouped: false },
});
