import { writable } from "svelte/store";

export interface Theme {
  source: string;
  appearance?: "dark" | "light";
}

export interface Connection {
  name: string;
  id: string;
}

export interface Settings {
  allowNSFW: boolean;
  ordered: boolean;
  reduceMotion: boolean;
  connections: Record<string, Connection>;
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
  connections: {},
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
