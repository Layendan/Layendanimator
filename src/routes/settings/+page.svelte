<script lang="ts">
  import Content from '$lib/components/Content.svelte';
  import ThemeButton from '$lib/components/ThemeButton.svelte';
  import ThemeCreator from '$lib/components/ThemeCreator.svelte';
  import { connections } from '$lib/model/connections';
  import { getVersion, getArch, getOS, checkUpdate } from '$lib/model/info';
  import { settings, tauriData, webData } from '$lib/model/settings';
  import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';

  const anilistClientId = '4602';

  let selected = $settings.sortSubscriptions;
</script>

<section>
  {#if window?.__TAURI__}
    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Settings
      </h1>

      <div class="grid w-fit grid-cols-2 items-center gap-4">
        <!-- Delete on Watch -->
        <label for="deleteOnWatch" class="text-lg font-medium">
          Delete Download on Watch
        </label>
        <input
          type="checkbox"
          id="deleteOnWatch"
          class="toggle-accent toggle"
          checked={$settings.deleteOnWatch}
          disabled={!window?.__TAURI__}
          on:change={() => ($settings.deleteOnWatch = !$settings.deleteOnWatch)}
        />

        <!-- In-App Notifications -->
        <label for="notifications" class="text-lg font-medium">
          In-App Notifications
        </label>
        <input
          type="checkbox"
          id="notifications"
          class="toggle-accent toggle"
          checked={$settings.notifications}
          disabled={!window?.__TAURI__}
          on:change={() => ($settings.notifications = !$settings.notifications)}
        />

        <!-- Subscription Sorting Algorithm -->
        <label for="subSort" class="text-lg font-medium">
          Subscriptions Anime Sorting
        </label>
        <select
          id="subSort"
          class="select-bordered select-accent select select-sm [font-weight:unset]"
          disabled={!window?.__TAURI__}
          bind:value={selected}
          on:change={() => ($settings.sortSubscriptions = selected)}
        >
          <option value="timeAdded">Time Added</option>
          <option value="title">Title</option>
          <option value="lastUpdated">Last Checked for Updates</option>
        </select>
      </div>
    </Content>

    <div class="divider" />

    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Themes
      </h1>

      <span class="mb-4 inline-flex w-full flex-wrap gap-4">
        {#each Object.values($settings.themes).sort((a, b) => a.id - b.id) as theme (theme.name)}
          <ThemeButton {theme} />
        {/each}
      </span>

      <div class="ml-auto mr-2">
        <ThemeCreator />
      </div>
    </Content>

    <div class="divider" />

    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Sources
      </h1>

      <i>Coming Soon...</i>
    </Content>

    <div class="divider" />

    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Connections
      </h1>

      <div class="flex gap-x-6">
        <a
          href="https://anilist.co/api/v2/oauth/authorize?client_id={anilistClientId}&response_type=token"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="rounded-lg ring ring-transparent transition-shadow duration-200 ease-in-out hover:ring-accent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 512 512"
            class="rounded-lg"
            class:grayscale={!$connections.anilist}
          >
            <path d="M0 0h512v512H0" fill="#1e2630" />
            <path
              d="M321.92 323.27V136.6c0-10.698-5.887-16.602-16.558-16.602h-36.433c-10.672 0-16.561 5.904-16.561 16.602v88.651c0 2.497 23.996 14.089 24.623 16.541 18.282 71.61 3.972 128.92-13.359 131.6 28.337 1.405 31.455 15.064 10.348 5.731 3.229-38.209 15.828-38.134 52.049-1.406.31.317 7.427 15.282 7.87 15.282h85.545c10.672 0 16.558-5.9 16.558-16.6v-36.524c0-10.698-5.886-16.602-16.558-16.602z"
              fill="#02a9ff"
            />
            <path
              d="M170.68 120 74.999 393h74.338l16.192-47.222h80.96L262.315 393h73.968l-95.314-273zm11.776 165.28 23.183-75.629 25.393 75.629z"
              fill="#fefefe"
            />
          </svg>
        </a>
      </div>
    </Content>

    <div class="divider" />
  {/if}

  <Content>
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Links
    </h1>

    <div class="flex space-x-6">
      <a
        href="https://github.com/Layendan/NineAnimator-Tauri"
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <Fa icon={faGithub} size="3x" />
      </a>
      <a
        href="https://discord.gg/dzTVzeW"
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <Fa icon={faDiscord} size="3x" />
      </a>
    </div>
  </Content>

  <div class="divider" />

  <Content>
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Data
    </h1>

    <div class="grid grid-cols-1 gap-4">
      {#each webData as { label, action }}
        <button class="btn-accent btn-outline btn w-full" on:click={action}>
          {label}
        </button>
      {/each}
      {#if window?.__TAURI__}
        {#each tauriData as { label, danger, action }}
          <button
            class="btn-outline btn w-full {danger ? 'btn-error' : 'btn-accent'}"
            on:click={action}
          >
            {label}
          </button>
        {/each}
      {/if}
    </div>
  </Content>

  {#if window?.__TAURI__}
    <div class="divider" />

    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        App Information
      </h1>

      <div class="ml-2">
        <p>
          <b>App Version:</b>
          {#await getVersion() then version}
            {version}
            <button
              class="btn-accent btn-outline btn-sm btn ml-2"
              on:click={checkUpdate}
            >
              Check For Updates
            </button>
          {/await}
        </p>
        <br />
        <p>
          <b>Operating System:</b>
          {#await getOS() then os}
            {os}
          {/await}
        </p>
        <br />
        <p>
          <b>System Archetype:</b>
          {#await getArch() then arch}
            {arch}
          {/await}
        </p>
      </div>
    </Content>
  {/if}
</section>
