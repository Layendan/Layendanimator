<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import ExternalLink from "$lib/components/public/ExternalLink.svelte";
  import Toggle from "$lib/components/public/Toggle.svelte";
  import Group from "$lib/components/settings/Group.svelte";
  import ThemePreview from "$lib/components/settings/Theme/ThemePreview.svelte";
  import SourcesDragDropList from "$lib/components/settings/sources/SourcesDragDropList.svelte";
  import SourceInput from "$lib/components/settings/sources/SourceInput.svelte";
  import anilistIcon from "$lib/components/assets/anilist.png";
  import { capitalize } from "$lib/model/global";
  import {
    settings,
    schema,
    type CustomTheme,
    type Schema,
  } from "$lib/model/settings";
  import { history } from "$lib/model/history";
  import { library } from "$lib/model/library";
  import { connections } from "$lib/model/connections";
  import { type ActiveSource, activeSources } from "$lib/model/sources";
  import { animes } from "$lib/model/anime";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { getVersion } from "@tauri-apps/api/app";
  import { open, save, confirm } from "@tauri-apps/api/dialog";
  import { downloadDir, appDir, join, basename } from "@tauri-apps/api/path";
  import { sendNotification } from "@tauri-apps/api/notification";
  import { getCurrent } from "@tauri-apps/api/window";
  import { open as shellOpen } from "@tauri-apps/api/shell";
  import {
    writeTextFile,
    readTextFile,
    removeFile,
    copyFile,
    BaseDirectory,
    type FsOptions,
  } from "@tauri-apps/api/fs";

  const client_id: string = "4602";
  let systemTheme: "light" | "dark" = "light";

  getCurrent().onThemeChanged(
    (theme) => (systemTheme = theme.payload as "dark" | "light")
  );

  async function getSystemTheme(): Promise<"dark" | "light"> {
    const theme = (await getCurrent().theme()) ?? "light";
    systemTheme = theme;
    return theme;
  }

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
   * Clears and deletes subscriptions.
   */
  function clearSubscriptions() {
    $library.subscriptions = [];
  }

  /**
   * Clears and deletes custom themes.
   */
  function clearThemes() {
    $settings.customThemes.forEach((theme) => {
      console.log("Removed: ", theme.source);
      removeFile(theme.source);
    });

    console.log($settings.theme);
    console.log($settings.customThemes);

    if ($settings.theme.custom)
      $settings.theme = {
        custom: undefined,
        syncWithSystem: true,
        appearance: "dark",
      };

    $settings.customThemes = [];

    console.log($settings.theme);
    console.log($settings.customThemes);
  }

  function clearConnections() {
    $connections = {};
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
    clearSubscriptions();
    clearConnections();
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
      ...((await open({
        title: "Import Custom Theme(s)",
        multiple: true,
        defaultPath: await downloadDir(),
        filters: [
          {
            name: "Stylesheets",
            extensions: ["css"],
          },
        ],
      })) ?? []),
    ];

    const appDirectory: string = await appDir();

    let themes: CustomTheme[] = await Promise.all(
      items.map(async (element) => {
        const title: string = await basename(element, ".css");
        const newPath: string = await join(
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
        !$settings.customThemes.some((theme) => theme.name === item.name)
    );

    return themes;
  }

  /**
   * Writes settings to the provided path.
   *
   * @param path The path to write the settings to.
   * @param options Options to give to tauri fs.writeTextFile.
   */
  async function writeSettings(
    path: string,
    options?: FsOptions
  ): Promise<void> {
    return writeTextFile(
      path,
      JSON.stringify({
        schemaVersion: schema.schemaVersion,
        date: Date.now(),
        version: await getVersion(),
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
  async function readSettings(newSettings: Schema): Promise<void> {
    newSettings.customThemes.forEach(async (theme) => {
      const themes: string = await join("themes", theme.name + ".css");
      await writeTextFile(themes, theme.content, { dir: BaseDirectory.App });
    });
    const schemaVersion: number = newSettings.schemaVersion;
    const date: number = newSettings.date;
    const version: string = newSettings.version;
    const sourceRepos: { name: string; url: string }[] =
      newSettings.sourceRepos;
    const activeSources: ActiveSource[] = newSettings.activeSources;
    settings.add(newSettings.settings);
    history.set(newSettings.history);
    newSettings.history.browse.forEach((item) => animes.addAnime(item));
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

<main in:fade>
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
      on:change={() => ($settings.showProgress = !$settings.showProgress)}
      checked={$settings.showProgress}
    >
      Show Episode Progress
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
    title="Sources"
    description="Edit sources to use for searching and browsing"
  >
    <SourceInput />
    {#if $activeSources.length > 0}
      <SourcesDragDropList bind:data={$activeSources} />
    {/if}
  </Group>
  <Group
    title="Third-Party Connections"
    description="Connect to third-party services"
  >
    <!-- TODO: Read from plugins and each loop -->
    <!-- { name: anilist, link: https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token, callback?: voidfunction } -->
    <!-- Remove the disabled when Tauri comes out with deep linking -->
    <Button
      on:click={() =>
        shellOpen(
          `https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token`
        )}
      disabled={!!$connections["anilist"] || true}
    >
      <span>
        {!$connections["anilist"] ? "Connect" : "Connected"} to Anilist
        <img src={anilistIcon} alt="anilist" />
      </span>
    </Button>
    <Button
      on:click={() =>
        goto(
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
        theme="dark"
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
        theme="light"
        selected={!$settings.theme.syncWithSystem &&
          $settings.theme.appearance === "light"}
        on:click={() =>
          ($settings.theme = {
            custom: undefined,
            syncWithSystem: false,
            appearance: "light",
          })}>Light Mode</ThemePreview
      >
      {#await getSystemTheme() then}
        <ThemePreview
          theme={systemTheme ?? "light"}
          selected={$settings.theme.syncWithSystem}
          on:click={() =>
            ($settings.theme = {
              custom: undefined,
              syncWithSystem: true,
              appearance: systemTheme ?? "light",
            })}>Sync With System</ThemePreview
        >
      {/await}
      {#each $settings.customThemes as theme}
        <ThemePreview
          theme={theme.name}
          selected={$settings.theme.custom?.source === theme.source}
          on:click={() =>
            ($settings.theme = {
              custom: theme,
              syncWithSystem: false,
              appearance: "custom",
            })}>{capitalize(theme.name)}</ThemePreview
        >
      {/each}
    </div>
    <block>
      <Button
        size="medium"
        on:click={async () =>
          ($settings.customThemes = [
            ...$settings.customThemes,
            ...(await importCustomThemes()),
          ].sort((a, b) => a.name.localeCompare(b.name)))}>Import Theme</Button
      >
      <Button size="medium">Export Theme</Button>
    </block>
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
    <block>
      <Button size="medium" on:click={exportSettings}>Create Backup</Button>
      <Button size="medium" on:click={importSettings}>Import Backup</Button>
      <Button size="medium" on:click={clearCache}>Clear Cached Data</Button>
      <Button size="medium" on:click={clearSearchHistory}
        >Clear Search History</Button
      >
      <Button size="medium" on:click={clearBrowseHistory}
        >Clear Browse History</Button
      >
      <Button size="medium" on:click={clearDownloads}>Clear Downloads</Button>
      <Button size="medium" on:click={clearSubscriptions}
        >Clear Subscriptions</Button
      >
      <Button size="medium" on:click={clearThemes}>Clear Themes</Button>
      <Button size="medium" on:click={clearConnections}
        >Clear Connections</Button
      >
      <Button
        size="medium"
        type="danger"
        on:click={async () =>
          (await confirm("(There is no going back)", {
            title: "Are you sure you want to reset everything?",
            type: "warning",
          })) && reset()}>Reset</Button
      >
    </block>
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

  block {
    display: flex;
    flex-direction: column;
  }

  .theme-holder {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: left;
    gap: 1rem;
  }
</style>
