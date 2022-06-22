<script lang="ts">
  import Button from "$lib/components/public/Button.svelte";
  import ExternalLink from "$lib/components/public/ExternalLink.svelte";
  import Toggle from "$lib/components/public/Toggle.svelte";
  import Group from "$lib/components/settings/Group.svelte";
  import { settings } from "../../model/settings";
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
  </Group>
  <Group title="Customization" description="Personalize the App">
    <Toggle
      on:change={() =>
        settings.set({
          ...$settings,
          theme: {
            ...$settings.theme,
            enabled: !$settings.theme.enabled,
          },
        })}
      checked={$settings.theme.enabled}
    >
      Enable Theming
    </Toggle>
    <div class="button-holder">
      <Button class="button" disabled={!$settings.theme.enabled}
        >Import Theme</Button
      >
      <Button class="button" disabled={!$settings.theme.enabled}
        >Export Theme</Button
      >
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
      <Button class="button" on:click={() => window?.sessionStorage.clear()}
        >Clear Cached Data</Button
      >
      <Button class="button">Clear Search History</Button>
      <Button class="button">Clear Browse History</Button>
      <Button class="button">Clear Downloads</Button>
      <Button class="button" buttonType="danger">Reset</Button>
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

  .button-holder :global(.button) {
    display: block;
    width: 200px;
  }
</style>
