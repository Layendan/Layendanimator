<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import ExternalLink from "$lib/components/public/ExternalLink.svelte";
  import Toggle from "$lib/components/public/Toggle.svelte";
  import Group from "$lib/components/settings/Group.svelte";
  import { settings, type CustomTheme } from "$lib/model/settings";
  import ThemePreview from "$lib/components/settings/Theme/ThemePreview.svelte";
  import anilistIcon from "$lib/components/assets/anilist.png";
  import darkPreview from "$lib/components/assets/dark.png";
  import { onMount } from "svelte";
  import { capitalize } from "$lib/model/global";
  import { history } from "$lib/model/history";
  import { library } from "$lib/model/library";
  let open: typeof import("@tauri-apps/api/dialog").open;
  let confirm: typeof import("@tauri-apps/api/dialog").confirm;
  let downloadDir: typeof import("@tauri-apps/api/path").downloadDir;
  let sep: typeof import("@tauri-apps/api/path").sep;
  let notification: typeof import("@tauri-apps/api/notification");
  let appWindow: typeof import("@tauri-apps/api/window").appWindow;
  let shellOpen: typeof import("@tauri-apps/api/shell").open;

  onMount(async () => {
    const dialog = await import("@tauri-apps/api/dialog");
    open = dialog.open;
    confirm = dialog.confirm;
    downloadDir = (await import("@tauri-apps/api/path")).downloadDir;
    sep = (await import("@tauri-apps/api/path")).sep;
    notification = await import("@tauri-apps/api/notification");
    appWindow = (await import("@tauri-apps/api/window")).appWindow;
    shellOpen = (await import("@tauri-apps/api/shell")).open;
  });

  let client_id: string = "4602";

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

  function clearBrowseHistory() {
    $history.browse = [];
  }

  function clearDownloads() {
    // TODO: remove downloads from disk
    $library.downloads = [];
  }

  /**
   * Resets the entirety of the application.
   */
  function reset() {
    clearCache();
    clearSearchHistory();
    clearBrowseHistory();
    clearDownloads();
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
    let items: string[] = [
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

    let themes: CustomTheme[] = items.map((element) => {
      return {
        name: element
          .substring(element.lastIndexOf(sep) + 1)
          .replace(".css", ""),
        source: element,
      };
    });

    themes = themes.filter(
      (item) =>
        !$settings.customThemes.some((theme) => theme.source === item.source)
    );

    return themes;
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
  </Group>
  <Group
    title="Third-Party Connections"
    description="Connect to third-party services"
  >
    <Button
      on:click={() =>
        shellOpen(
          `https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token`
        )}
    >
      <span>
        Connect to Anilist
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
        notification.sendNotification({
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
            appearance: (await appWindow.theme()) ?? "light",
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
      <Button class="button">Create Backup</Button>
      <Button class="button">Import Backup</Button>
      <Button class="button" on:click={clearCache}>Clear Cached Data</Button>
      <Button class="button" on:click={clearSearchHistory}
        >Clear Search History</Button
      >
      <Button class="button" on:click={clearBrowseHistory}
        >Clear Browse History</Button
      >
      <Button class="button" on:click={clearDownloads}>Clear Downloads</Button>
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
