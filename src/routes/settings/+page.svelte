<script lang="ts">
  import Content from '$lib/components/Content.svelte';
  import ProviderCreator from '$lib/components/ProviderCreator.svelte';
  import SourceInfoButton from '$lib/components/SourceInfoButton.svelte';
  import ThemeButton from '$lib/components/ThemeButton.svelte';
  import ThemeCreator from '$lib/components/ThemeCreator.svelte';
  import { animeCache } from '$lib/model/cache';
  import { checkUpdate, getArch, getOS, getVersion } from '$lib/model/info';
  import { settings, tauriData, webData } from '$lib/model/settings';
  import { providers } from '$lib/model/source';
  import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
  import {
    faCloudArrowDown,
    faInfoCircle
  } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  // const anilistClientId = '4602';

  let selected = $settings.sortSubscriptions;
</script>

<section class="m-4">
  {#if window?.__TAURI__}
    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Settings
      </h1>

      <div>
        <!-- Delete on Watch -->
        <label class="label w-fit" for="deleteOnWatch">
          <span class="label-text">Delete Download on Watch</span>
        </label>
        <input
          type="checkbox"
          id="deleteOnWatch"
          class="toggle toggle-accent"
          checked={$settings.deleteOnWatch}
          on:change={() => ($settings.deleteOnWatch = !$settings.deleteOnWatch)}
        />

        <!-- In-App Notifications -->
        <label class="label w-fit" for="notifications">
          <span class="label-text">
            In-App Notifications
            <br />
            <i
              class="inline-flex items-center rounded-md bg-warning px-1 py-[0.1rem] text-xs text-warning-content shadow-md"
            >
              <Fa icon={faInfoCircle} class="mr-1" />
              enable for error messages
            </i>
          </span>
        </label>
        <input
          type="checkbox"
          id="notifications"
          class="toggle toggle-accent"
          checked={$settings.notifications}
          on:change={() => ($settings.notifications = !$settings.notifications)}
        />

        <!-- Sub or Dub -->
        <label class="label w-fit" for="isSub">
          <span class="label-text">Fetch Sub Episodes</span>
        </label>
        <input
          type="checkbox"
          id="isSub"
          class="toggle toggle-accent"
          checked={$settings.isSubtitles}
          on:change={() => {
            $settings.isSubtitles = !$settings.isSubtitles;
            animeCache.clear();
          }}
        />

        <!-- Fetch Filler -->
        <label class="label w-fit" for="fetchFiller">
          <span class="label-text">Fetch Filler Episodes</span>
        </label>
        <input
          type="checkbox"
          id="fetchFiller"
          class="toggle toggle-accent"
          checked={$settings.filler}
          on:change={() => ($settings.filler = !$settings.filler)}
        />

        <!-- Parallax -->
        <label class="label w-fit" for="parallax">
          <span class="label-text">
            Cover Parallax
            <br />
            <i
              class="inline-flex items-center rounded-md bg-warning px-1 py-[0.1rem] text-xs text-warning-content shadow-md"
            >
              <Fa icon={faInfoCircle} class="mr-1" />
              disable for performance
            </i>
          </span>
        </label>
        <input
          type="checkbox"
          id="parallax"
          class="toggle toggle-accent"
          checked={$settings.parallax}
          on:change={() => ($settings.parallax = !$settings.parallax)}
        />

        <!-- Show Source on Anime -->
        <label class="label w-fit" for="showSourcesOnAnime">
          <span class="label-text"> Show Source Image on Anime </span>
        </label>
        <input
          type="checkbox"
          id="showSourcesOnAnime"
          class="toggle toggle-accent"
          checked={$settings.showSourcesOnAnime}
          on:change={() =>
            ($settings.showSourcesOnAnime = !$settings.showSourcesOnAnime)}
        />

        <!-- Check for updates of animes that have already completed -->
        <label class="label w-fit" for="checkCompletedUpdates">
          <span class="label-text">
            Check Updates for Completed Animes
            <br />
            <i
              class="inline-flex items-center rounded-md bg-warning px-1 py-[0.1rem] text-xs text-warning-content shadow-md"
            >
              <Fa icon={faInfoCircle} class="mr-1" />
              prone to getting rate limited
            </i>
          </span>
        </label>
        <input
          type="checkbox"
          id="checkCompletedUpdates"
          class="toggle toggle-accent"
          checked={$settings.checkCompletedUpdates}
          on:change={() =>
            ($settings.checkCompletedUpdates =
              !$settings.checkCompletedUpdates)}
        />

        <!-- Check for updates of animes that have already completed -->
        <label class="label w-fit" for="showAllSubscriptions">
          <span class="label-text">
            Show All Subscriptions on Main Page
            <br />
            <i
              class="inline-flex items-center rounded-md bg-warning px-1 py-[0.1rem] text-xs text-warning-content shadow-md"
            >
              <Fa icon={faInfoCircle} class="mr-1" />
              disable for performance
            </i>
          </span>
        </label>
        <input
          type="checkbox"
          id="showAllSubscriptions"
          class="toggle toggle-accent"
          checked={$settings.showAllSubscriptions}
          on:change={() =>
            ($settings.showAllSubscriptions = !$settings.showAllSubscriptions)}
        />

        <!-- DiscordRPC -->
        <label class="label w-fit" for="discordRPC">
          <span class="label-text"> Enable Discord Rich Presence </span>
        </label>
        <input
          type="checkbox"
          id="discordRPC"
          class="toggle toggle-accent"
          checked={$settings.discordRPC === 'enabled'}
          on:change={async () => {
            $settings.discordRPC =
              $settings.discordRPC === 'enabled' ? 'disabled' : 'enabled';
            const { invoke } = await import('@tauri-apps/api/tauri');
            if ($settings.discordRPC === 'enabled') invoke('reset_activity');
            else invoke('clear_activity');
          }}
        />

        <!-- Background Video -->
        <label class="label w-fit" for="backgroundVideo">
          <span class="label-text"> Play Background Videos </span>
        </label>
        <input
          type="checkbox"
          id="backgroundVideo"
          class="toggle toggle-accent"
          checked={$settings.playVideoInBackground}
          on:change={async () =>
            ($settings.playVideoInBackground =
              !$settings.playVideoInBackground)}
        />

        <!-- Airplay -->
        <label class="label w-fit" for="preferNativeHls">
          <span class="label-text">
            Use Native HLS for Airplay
            <br />
            <i
              class="inline-flex items-center rounded-md bg-warning px-1 py-[0.1rem] text-xs text-warning-content shadow-md"
            >
              <Fa icon={faInfoCircle} class="mr-1" />
              macos only
            </i>
          </span>
        </label>
        <input
          type="checkbox"
          id="preferNativeHls"
          class="toggle toggle-accent"
          checked={$settings.preferNativeHls}
          on:change={async () =>
            ($settings.preferNativeHls = !$settings.preferNativeHls)}
        />

        <!-- Subscription Sorting Algorithm -->
        <label class="label w-fit" for="subSort">
          <span class="label-text">Subscriptions Anime Sorting</span>
        </label>
        <select
          id="subSort"
          class="select select-bordered select-accent select-sm [font-weight:unset]"
          bind:value={selected}
          on:change={() => ($settings.sortSubscriptions = selected)}
        >
          <option value="timeAdded">Time Added</option>
          <option value="title">Title</option>
          <option value="nextEpisode">Time Until Next Episode</option>
          <option value="lastUpdated">Last Checked for Updates</option>
        </select>
      </div>
    </Content>

    <div class="divider" />

    <Content>
      <div class="mb-4 flex items-center gap-1">
        <h1
          class="mr-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
        >
          Sources
        </h1>

        <ProviderCreator />
      </div>

      <span class="mb-4 inline-flex w-full flex-wrap gap-4">
        {#each Object.values($providers) as source (source.id)}
          <SourceInfoButton {source} />
        {/each}
      </span>
    </Content>

    <div class="divider" />

    <Content>
      <div class="mb-4 flex items-center gap-1">
        <h1
          class="mr-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
        >
          Themes
        </h1>

        <ThemeCreator />
      </div>

      <span class="mb-4 inline-flex w-full flex-wrap gap-4">
        {#each Object.values($settings.themes).sort((a, b) => a.id - b.id) as theme (theme.name)}
          <ThemeButton {theme} />
        {/each}
      </span>
    </Content>

    <div class="divider" />

    <Content>
      <h1
        class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
      >
        Connections
      </h1>

      <div class="flex gap-x-6">
        Coming Soon...

        <!-- <a
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
        </a> -->
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
        aria-label="GitHub Repository"
      >
        <Fa icon={faGithub} size="3x" />
      </a>
      <a
        href="https://discord.gg/dzTVzeW"
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label="Discord Server"
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
        <button class="btn btn-outline w-full" on:click={action}>
          {label}
        </button>
      {/each}
      {#if window?.__TAURI__}
        {#each tauriData as { label, danger, action }}
          <button
            class="btn btn-outline w-full"
            class:btn-error={danger}
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
              class="btn btn-outline btn-accent btn-sm ml-2"
              on:click={checkUpdate}
            >
              <Fa icon={faCloudArrowDown} />
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
