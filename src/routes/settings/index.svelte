<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import ExternalLink from "$lib/components/public/ExternalLink.svelte";
  import Toggle from "$lib/components/public/Toggle.svelte";
  import Group from "$lib/components/settings/Group.svelte";
  import {
    defaultSettings,
    settings,
    type CustomTheme,
  } from "$lib/model/settings";
  import ThemePreview from "$lib/components/settings/Theme/ThemePreview.svelte";
  import anilistIcon from "$lib/components/assets/anilist.png";
  import darkPreview from "$lib/components/assets/dark.png";
  import { onMount } from "svelte";
  let open: typeof import("@tauri-apps/api/dialog").open;
  let confirm: typeof import("@tauri-apps/api/dialog").confirm;
  let downloadDir: typeof import("@tauri-apps/api/path").downloadDir;
  let notification: typeof import("@tauri-apps/api/notification");

  onMount(async () => {
    const dialog = await import("@tauri-apps/api/dialog");
    open = dialog.open;
    confirm = dialog.confirm;
    downloadDir = (await import("@tauri-apps/api/path")).downloadDir;
    notification = await import("@tauri-apps/api/notification");
  });

  let client_id: string = "4602";

  function clearCache() {
    window?.sessionStorage.clear();
  }

  function reset() {
    clearCache();
    settings.set(defaultSettings);
  }

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

    items.forEach((item) => {
      console.log(item);
    });
    let themes: CustomTheme[] = items.map((element) => {
      return {
        name: element.substring(element.search("([^/]+$)")).replace(".css", ""),
        source: element,
      };
    });

    return themes;
  }

  async function getCustomTheme(): Promise<CustomTheme> {
    return $settings.customThemes[0] ?? { name: "test", source: "test" };
  }
</script>

<main>
  <Group title="Settings" description="General Settings">
    <Toggle
      on:change={() =>
        settings.set({ ...$settings, allowNSFW: !$settings.allowNSFW })}
      checked={$settings.allowNSFW}
    >
      Display NSFW Animes
    </Toggle>
    <Toggle
      on:change={() =>
        settings.set({
          ...$settings,
          ordered: !$settings.ordered,
        })}
      checked={!$settings.ordered}
    >
      Reverse Episode Order
    </Toggle>
    <Toggle
      on:change={() =>
        settings.set({
          ...$settings,
          reduceMotion: !$settings.reduceMotion,
        })}
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
        window?.__TAURI__?.shell.open(
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
        settings.set({
          ...$settings,
          notifications: {
            ...$settings.notifications,
            enabled: !$settings.notifications.enabled,
          },
        })}
      checked={$settings.notifications.enabled}
    >
      Enable Notifications
    </Toggle>
    <Toggle
      on:change={() =>
        settings.set({
          ...$settings,
          notifications: {
            ...$settings.notifications,
            grouped: !$settings.notifications.grouped,
          },
        })}
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
        title={"Dark Mode"}
        image={darkPreview}
        selected={!$settings.theme.syncWithSystem &&
          $settings.theme.appearance === "dark"}
        on:click={() =>
          settings.set({
            ...$settings,
            theme: {
              custom: undefined,
              syncWithSystem: false,
              appearance: "dark",
            },
          })}
      />
      <ThemePreview
        title={"Light Mode"}
        image={darkPreview}
        selected={!$settings.theme.syncWithSystem &&
          $settings.theme.appearance === "light"}
        on:click={() =>
          settings.set({
            ...$settings,
            theme: {
              custom: undefined,
              syncWithSystem: false,
              appearance: "light",
            },
          })}
      />
      <ThemePreview
        title={"Sync With System"}
        image={darkPreview}
        selected={$settings.theme.syncWithSystem}
        on:click={async () =>
          settings.set({
            ...$settings,
            theme: {
              custom: undefined,
              syncWithSystem: true,
              appearance: await window?.__TAURI__?.window.appWindow.theme(),
            },
          })}
      />
      <ThemePreview
        title={"Custom Theme"}
        image={darkPreview}
        selected={!!$settings.theme.custom}
        disabled={$settings.customThemes.length === 0}
        on:click={async () =>
          settings.set({
            ...$settings,
            theme: {
              custom: {
                ...(await getCustomTheme()),
              },
              syncWithSystem: false,
              appearance: undefined,
            },
          })}
      />
    </div>
    <div class="button-holder">
      <Button
        class="button"
        on:click={async () =>
          settings.set({
            ...$settings,
            customThemes: [
              ...$settings.customThemes,
              ...(await importCustomThemes()),
            ],
          })}>Import Theme</Button
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
      <Button class="button">Clear Search History</Button>
      <Button class="button">Clear Browse History</Button>
      <Button class="button">Clear Downloads</Button>
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
