import { writable } from "svelte/store";
import type { ActiveSource } from "./sources";
import type { History } from "./history";

export interface CustomTheme {
  name: string;
  source: string;
}

export interface Theme {
  custom: CustomTheme | undefined;
  syncWithSystem: boolean;
  appearance: "dark" | "light" | "custom";
}

export interface Settings {
  allowNSFW: boolean;
  ordered: boolean;
  reduceMotion: boolean;
  showProgress: boolean;
  animeLanguage: "english" | "native";
  notifications: {
    enabled: boolean;
    grouped: boolean;
  };
  theme: Theme;
  customThemes: CustomTheme[];
}

function createSettings() {
  const { subscribe, set, update } = writable<Settings>({
    allowNSFW: false,
    ordered: true,
    reduceMotion: false,
    showProgress: false,
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
    /**
     * Safely add new settings to the already existing one.
     * @param settings The Settings to add.
     */
    add: (settings: Settings) =>
      update((oldSettings) => {
        return {
          allowNSFW: settings?.allowNSFW ?? oldSettings.allowNSFW,
          ordered: settings?.ordered ?? oldSettings.ordered,
          reduceMotion: settings?.reduceMotion ?? oldSettings.reduceMotion,
          showProgress: settings?.showProgress ?? oldSettings.showProgress,
          animeLanguage: settings?.animeLanguage ?? oldSettings.animeLanguage,
          notifications: {
            enabled:
              settings?.notifications?.enabled ??
              oldSettings.notifications.enabled,
            grouped:
              settings?.notifications?.grouped ??
              oldSettings.notifications.grouped,
          },
          theme: {
            custom: settings?.theme?.custom ?? oldSettings.theme.custom,
            syncWithSystem:
              settings?.theme?.syncWithSystem ??
              oldSettings.theme.syncWithSystem,
            appearance:
              settings?.theme?.appearance ?? oldSettings.theme.appearance,
          },
          customThemes: [...settings?.customThemes],
        };
      }),
    /**
     * Resets the settings to their original state.
     */
    reset: () =>
      set({
        allowNSFW: false,
        ordered: true,
        reduceMotion: false,
        showProgress: false,
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

export interface Schema {
  schemaVersion: number;
  date: number;
  version: string;
  sourceRepos: { name: string; url: string }[];
  activeSources: ActiveSource[];
  settings: Settings;
  history: History;
  customThemes: { name: string; content: string }[];
}

/**
 * Data about the schema, might be removed later
 */
export const schema = {
  schemaVersion: 0.1,
};
