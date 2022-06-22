import { writable } from "svelte/store";

export interface Theme {
  source: string;
}

export interface Settings {
  allowNSFW: boolean;
  ordered: boolean;
  reduceMotion: boolean;
  notifications: {
    enabled: boolean;
    grouped: boolean;
  };
  theme: {
    enabled: boolean;
    details?: Theme;
  };
}

export const settings = writable<Settings>({
  allowNSFW: false,
  ordered: true,
  reduceMotion: false,
  notifications: { enabled: true, grouped: false },
  theme: { enabled: false, details: { source: "" } },
});
