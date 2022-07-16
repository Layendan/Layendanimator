import { writable } from "svelte/store";

export interface CustomTheme {
  name: string;
  source: string;
}

export interface Theme {
  custom: CustomTheme | undefined;
  syncWithSystem: boolean;
  appearance: "dark" | "light" | undefined;
}

export interface Settings {
  allowNSFW: boolean;
  ordered: boolean;
  reduceMotion: boolean;
  animeLanguage: "english" | "native";
  notifications: {
    enabled: boolean;
    grouped: boolean;
  };
  theme: Theme;
  customThemes: CustomTheme[];
}

export function isSettings(settings: any): settings is Settings {
  return (
    settings &&
    typeof settings.allowNSFW === "boolean" &&
    typeof settings.ordered === "boolean" &&
    typeof settings.reduceMotion === "boolean" &&
    typeof settings.animeLanguage === "string" &&
    typeof settings.notifications === "object" &&
    typeof settings.notifications.enabled === "boolean" &&
    typeof settings.notifications.grouped === "boolean" &&
    typeof settings.theme === "object" &&
    typeof settings.theme.custom === "object" &&
    typeof settings.theme.syncWithSystem === "boolean" &&
    typeof settings.theme.appearance === "string" &&
    typeof settings.customThemes === "object"
  );
}

function createSettings() {
  const { subscribe, set, update } = writable<Settings>({
    allowNSFW: false,
    ordered: true,
    reduceMotion: false,
    animeLanguage: "english",
    notifications: {
      enabled: true,
      grouped: false,
    },
    theme: { custom: undefined, syncWithSystem: true, appearance: "dark" },
    customThemes: [],
  });

  return {
    subscribe,
    set,
    update,
    reset: () =>
      set({
        allowNSFW: false,
        ordered: true,
        reduceMotion: false,
        animeLanguage: "english",
        notifications: {
          enabled: true,
          grouped: false,
        },
        theme: { custom: undefined, syncWithSystem: true, appearance: "dark" },
        customThemes: [],
      }),
  };
}

export const settings = createSettings();
