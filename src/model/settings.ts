import { writable } from "svelte/store";

export interface Theme {
  source: string;
  appearance?: "dark" | "light";
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
    syncWithSystem: boolean;
    details?: Theme;
  };
}

export const defaultSettings: Settings = {
  allowNSFW: false,
  ordered: true,
  reduceMotion: false,
  notifications: {
    enabled: true,
    grouped: false,
  },
  theme: {
    enabled: false,
    syncWithSystem: true,
    details: {
      source: "",
      appearance: "dark",
    },
  },
};

export const settings = writable<Settings>(defaultSettings);
