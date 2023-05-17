<script lang="ts">
  import Content from '$lib/components/Content.svelte';
  import {
    animeCache,
    episodeCache,
    popularAnimes,
    recentEpisodes,
    trendingAnimes
  } from '$lib/model/cache';
  import { connections } from '$lib/model/connections';
  import { downloads } from '$lib/model/downloads';
  import { providers, source } from '$lib/model/source';
  import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';
  import { open } from '@tauri-apps/api/shell';
  import { join, appDataDir } from '@tauri-apps/api/path';
  import {
    isPermissionGranted,
    requestPermission,
    sendNotification
  } from '@tauri-apps/api/notification';
  import { getVersion } from '@tauri-apps/api/app';
  import { arch, type } from '@tauri-apps/api/os';

  const anilistClientId = '4602';
</script>

<section>
  <div class="dropdown block">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <label tabindex="0" class="btn-outline btn-accent btn w-fit">
      Change Source
    </label>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
      tabindex="0"
      class="dropdown-content rounded-box z-10 mt-2 w-52 bg-base-200 p-2 shadow"
    >
      {#each $providers as provider}
        <li class="m-1">
          <button
            class="btn-outline btn-accent btn flex w-full flex-row items-center gap-1 text-base-content"
            disabled={$source.id === provider.id}
            on:click={() => source.set(provider)}
          >
            <img
              src={provider.logo}
              alt={provider.name}
              class="h-5 w-5 rounded-md"
            />
            {provider.name}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <div class="divider" />

  <Content>
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Connections
    </h1>
    <div class="flex space-x-6">
      <a
        href="https://anilist.co/api/v2/oauth/authorize?client_id={anilistClientId}&response_type=token"
        target="_blank"
        rel="noopener noreferrer"
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
        rel="noopener noreferrer"
      >
        <Fa icon={faGithub} size="3x" />
      </a>
      <a
        href="https://discord.gg/dzTVzeW"
        target="_blank"
        rel="noopener noreferrer"
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
      <button
        class="btn-outline btn-accent btn w-full"
        on:click={() => {
          recentEpisodes.clear();
          trendingAnimes.clear();
          popularAnimes.clear();
          animeCache.clear();
          episodeCache.clear();
          localStorage.clear();
        }}>Clear Cache</button
      >
      <button
        class="btn-outline btn-accent btn w-full"
        on:click={() => connections.clear()}>Clear Connections</button
      >
      <button
        class="btn-outline btn-accent btn w-full"
        on:click={() => downloads.clear()}>Delete Downloads</button
      >
      <button
        class="btn-outline btn-accent btn w-full"
        on:click={async () => {
          await open(await join(await appDataDir(), 'downloads'));
        }}>Open Downloads Folder</button
      >
      <button
        class="btn-outline btn-accent btn w-full"
        on:click={async () => {
          if (await isPermissionGranted()) {
            sendNotification({
              title: 'Test Notification',
              body: 'This is a test notification'
            });
          } else if ((await requestPermission()) === 'granted') {
            sendNotification({
              title: 'Test Notification',
              body: 'This is a test notification'
            });
          } else {
            console.error('Notification permission not granted');
          }
        }}>Send Test Notification</button
      >
    </div>
  </Content>

  <div class="divider" />

  <Content>
    <h1
      class="mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl"
    >
      Information
    </h1>
    <div class="ml-2">
      <p>
        <b>App Version:</b>
        {#await getVersion() then version}
          {version}
        {/await}
      </p>
      <br />
      <p>
        <b>Operating System:</b>
        {#await type() then os}
          {os}
        {/await}
      </p>
      <br />
      <p>
        <b>System Archetype:</b>
        {#await arch() then arch}
          {arch}
        {/await}
      </p>
    </div>
  </Content>
</section>
