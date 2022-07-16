<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import ExternalLink from "$lib/components/public/ExternalLink.svelte";
  import Toggle from "$lib/components/public/Toggle.svelte";
  import Group from "$lib/components/settings/Group.svelte";
  import {
    settings,
    isSettings,
    type CustomTheme,
    type Settings,
  } from "$lib/model/settings";
  import ThemePreview from "$lib/components/settings/Theme/ThemePreview.svelte";
  import path from "path";
  import anilistIcon from "$lib/components/assets/anilist.png";
  import darkPreview from "$lib/components/assets/dark.png";
  import { onMount } from "svelte";
  import { capitalize } from "$lib/model/global";
  import { history, type History } from "$lib/model/history";
  import { library } from "$lib/model/library";
  import { BaseDirectory, type FsOptions } from "@tauri-apps/api/fs";
  import { connections } from "$lib/model/connections";
  let open: typeof import("@tauri-apps/api/dialog").open;
  let save: typeof import("@tauri-apps/api/dialog").save;
  let confirm: typeof import("@tauri-apps/api/dialog").confirm;
  let downloadDir: typeof import("@tauri-apps/api/path").downloadDir;
  let appDir: typeof import("@tauri-apps/api/path").appDir;
  let sendNotification: typeof import("@tauri-apps/api/notification").sendNotification;
  let getCurrent: typeof import("@tauri-apps/api/window").getCurrent;
  let shellOpen: typeof import("@tauri-apps/api/shell").open;
  let writeTextFile: typeof import("@tauri-apps/api/fs").writeTextFile;
  let readTextFile: typeof import("@tauri-apps/api/fs").readTextFile;
  let removeFile: typeof import("@tauri-apps/api/fs").removeFile;
  let copyFile: typeof import("@tauri-apps/api/fs").copyFile;

  onMount(async () => {
    const dialog = await import("@tauri-apps/api/dialog");
    open = dialog.open;
    save = dialog.save;
    confirm = dialog.confirm;
    const path = await import("@tauri-apps/api/path");
    downloadDir = path.downloadDir;
    appDir = path.appDir;
    sendNotification = (await import("@tauri-apps/api/notification"))
      .sendNotification;
    getCurrent = (await import("@tauri-apps/api/window")).getCurrent;
    shellOpen = (await import("@tauri-apps/api/shell")).open;
    const fs = await import("@tauri-apps/api/fs");
    writeTextFile = fs.writeTextFile;
    readTextFile = fs.readTextFile;
    removeFile = fs.removeFile;
    copyFile = fs.copyFile;
  });

  const client_id: string = "4602";

  /**
   * Clears the session storage.
   */
  function clearCache() {
    window?.sessionStorage.clear();
  }

  /**
   * Clears the search history.
   */
  function clearSearchHistory() {
    $history.search = [];
  }

  /**
   * Clears the browse history.
   */
  function clearBrowseHistory() {
    $history.browse = [];
  }

  /**
   * Clears and deletes downloads.
   */
  function clearDownloads() {
    $library.downloads.forEach((episode) =>
      removeFile(episode.path).catch(() =>
        console.error(
          `Failed to remove ${episode.anime.title} at path: ${episode.path}`
        )
      )
    );
    $library.downloads = [];
  }

  /**
   * Clears and deletes custom themes.
   */
  function clearThemes() {
    $settings.customThemes.forEach((theme) => {
      removeFile(theme.source).catch(() =>
        console.error(`Failed to remove ${theme.name} at path: ${theme.source}`)
      );
    });

    if (!!$settings.theme.custom)
      $settings.theme = {
        custom: undefined,
        syncWithSystem: true,
        appearance: "dark",
      };

    $settings.customThemes = [];
  }

  /**
   * Resets the entirety of the application.
   */
  function reset() {
    clearCache();
    clearSearchHistory();
    clearBrowseHistory();
    clearDownloads();
    clearThemes();
    settings.reset();
  }

  /**
   * Opens a dialog box to choose which theme(s) to import.
   *
   * This function removes any duplicate themes.
   *
   * @returns A promise that resolves to the chosen theme(s).
   */
  async function importCustomThemes(): Promise<CustomTheme[]> {
    const items: string[] = [
      ...(await open({
        title: "Import Custom Theme(s)",
        multiple: true,
        defaultPath: await downloadDir(),
        filters: [
          {
            name: "Stylesheets",
            extensions: ["css"],
          },
        ],
      })),
    ];

    const appDirectory: string = await appDir();

    let themes: CustomTheme[] = await Promise.all(
      items.map(async (element) => {
        const title: string = path.basename(element, ".css");
        const newPath: string = path.join(
          appDirectory,
          "themes",
          title + ".css"
        );
        await copyFile(element, newPath);
        return {
          name: title,
          source: newPath,
        };
      })
    );

    themes = themes.filter(
      (item) =>
        !$settings.customThemes.some((theme) => theme.source === item.source)
    );

    return themes;
  }

  /**
   * Writes settings to the provided path.
   *
   * @param path The path to write the settings to.
   * @param options Options to give to tauri fs.writeTextFile.
   */
  export async function writeSettings(
    path: string,
    options?: FsOptions
  ): Promise<void> {
    return writeTextFile(
      path,
      JSON.stringify({
        settings: $settings,
        history: $history,
        customThemes: await Promise.all(
          $settings.customThemes.map(async (theme) => {
            return {
              name: theme.name,
              content: await readTextFile(theme.source),
            };
          })
        ),
      }),
      options
    );
  }

  /**
   * Sets the settings stores from the given object.
   *
   * @param newSettings Object to set the settings to.
   */
  export async function readSettings(newSettings: {
    settings: Settings;
    history: History;
    customThemes: { name: string; content: string }[];
  }): Promise<void> {
    newSettings.customThemes.forEach(async (theme) => {
      const themes: string = path.join("themes", theme.name + ".css");
      await writeTextFile(themes, theme.content, { dir: BaseDirectory.App });
    });
    if (isSettings(newSettings.settings)) {
      settings.set(newSettings.settings);
    }
    history.set(newSettings.history);
  }

  /**
   * Opens a dialog box to choose where to export the settings
   *
   * @returns A promise that resolves with an error.
   */
  async function exportSettings(): Promise<void> {
    const path = await save({
      title: "Export Settings",
      defaultPath: await downloadDir(),
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    return writeSettings(path);
  }

  /**
   * Opens a dialog box to choose which settings file to import.
   *
   * @returns A promise that resolves with an error.
   */
  async function importSettings(): Promise<void> {
    const path: string = (await open({
      title: "Import Settings",
      multiple: false,
      defaultPath: await downloadDir(),
      filters: [{ name: "JSON", extensions: ["json"] }],
    })) as string;
    return readSettings(JSON.parse(await readTextFile(path)));
  }
</script>

<main>
  <Group title="Settings" description="General Settings">
    <Toggle
      on:change={() => ($settings.allowNSFW = !$settings.allowNSFW)}
      checked={$settings.allowNSFW}
    >
      Display NSFW Animes
    </Toggle>
    <Toggle
      on:change={() => ($settings.ordered = !$settings.ordered)}
      checked={!$settings.ordered}
    >
      Reverse Episode Order
    </Toggle>
    <Toggle
      on:change={() => ($settings.reduceMotion = !$settings.reduceMotion)}
      checked={$settings.reduceMotion}
    >
      Reduce Motion
    </Toggle>
    <Toggle
      on:change={() =>
        ($settings.animeLanguage =
          $settings.animeLanguage === "english" ? "native" : "english")}
      checked={$settings.animeLanguage === "english"}
    >
      Change Anime Language - {capitalize($settings.animeLanguage)}
    </Toggle>
  </Group>
  <Group
    title="Third-Party Connections"
    description="Connect to third-party services"
  >
    <!-- TODO: Read from plugins and each loop -->
    <!-- { name: anilist, link: https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token, callback?: voidfunction } -->
    <Button
      on:click={() =>
        shellOpen(
          `https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token`
        )}
      disabled={!!$connections["anilist"]}
    >
      <span>
        {!$connections["anilist"] ? "Connect" : "Connected"} to Anilist
        <img src={anilistIcon} alt="anilist" />
      </span>
    </Button>
  </Group>
  <Group title="Notifications" description="Notification Settings">
    <Toggle
      on:change={() =>
        ($settings.notifications.enabled = !$settings.notifications.enabled)}
      checked={$settings.notifications.enabled}
    >
      Enable Notifications
    </Toggle>
    <Toggle
      on:change={() =>
        ($settings.notifications.grouped = !$settings.notifications.grouped)}
      checked={$settings.notifications.grouped}
      disabled={!$settings.notifications.enabled}
    >
      Group Notifications
    </Toggle>
    <Button
      on:click={() =>
        sendNotification({
          title: "Test Notification",
          body: "This is a test notification",
        })}>Test Notification</Button
    >
  </Group>
  <Group title="Customization" description="Personalize the App">
    <div class="theme-holder">
      <ThemePreview
        image={darkPreview}
        selected={!$settings.theme.syncWithSystem &&
          $settings.theme.appearance === "dark"}
        on:click={() =>
          ($settings.theme = {
            custom: undefined,
            syncWithSystem: false,
            appearance: "dark",
          })}>Dark Mode</ThemePreview
      >
      <ThemePreview
        image={darkPreview}
        selected={!$settings.theme.syncWithSystem &&
          $settings.theme.appearance === "light"}
        on:click={() =>
          ($settings.theme = {
            custom: undefined,
            syncWithSystem: false,
            appearance: "light",
          })}>Light Mode</ThemePreview
      >
      <ThemePreview
        image={darkPreview}
        selected={$settings.theme.syncWithSystem}
        on:click={async () =>
          ($settings.theme = {
            custom: undefined,
            syncWithSystem: true,
            appearance: (await getCurrent().theme()) ?? "light",
          })}>Sync With System</ThemePreview
      >
      {#each $settings.customThemes as theme}
        <ThemePreview
          image={darkPreview}
          selected={$settings.theme.custom?.source === theme.source}
          on:click={() =>
            ($settings.theme = {
              custom: theme,
              syncWithSystem: false,
              appearance: undefined,
            })}>{capitalize(theme.name)}</ThemePreview
        >
      {/each}
    </div>
    <div class="button-holder">
      <Button
        class="button"
        on:click={async () =>
          ($settings.customThemes = [
            ...$settings.customThemes,
            ...(await importCustomThemes()),
          ].sort((a, b) => a.name.localeCompare(b.name)))}>Import Theme</Button
      >
      <Button class="button">Export Theme</Button>
    </div>
  </Group>
  <Group title="About" description="About Layendanimator">
    <ExternalLink href="https://github.com/Layendan/NineAnimator-Tauri"
      >About</ExternalLink
    >
    <ExternalLink href="https://github.com/Layendan/NineAnimator-Tauri">
      Github Repository
    </ExternalLink>
  </Group>
  <Group title="Data & Privacy" description="Manage your Data and Privacy">
    <div class="button-holder">
      <Button class="button" on:click={exportSettings}>Create Backup</Button>
      <Button class="button" on:click={importSettings}>Import Backup</Button>
      <Button class="button" on:click={clearCache}>Clear Cached Data</Button>
      <Button class="button" on:click={clearSearchHistory}
        >Clear Search History</Button
      >
      <Button class="button" on:click={clearBrowseHistory}
        >Clear Browse History</Button
      >
      <Button class="button" on:click={clearDownloads}>Clear Downloads</Button>
      <Button class="button" on:click={clearThemes}>Clear Themes</Button>
      <Button
        class="button"
        buttonType="danger"
        on:click={async () =>
          (await confirm("(There is no going back)", {
            title: "Are you sure you want to reset everything?",
            type: "warning",
          })) && reset()}>Reset</Button
      >
    </div>
  </Group>
</main>

<style>
  main {
    display: inline-flex;
    flex-direction: column;
    margin: 2rem;
    margin-top: 5rem;
    row-gap: 1rem;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.5rem;
  }

  span > img {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 5px;
  }

  .theme-holder {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: left;
    gap: 1rem;
  }

  .button-holder :global(.button) {
    display: block;
    width: 200px;
  }
</style>
