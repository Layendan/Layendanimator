<script lang="ts">
  import Content from '$lib/components/Content.svelte';
  import {
    animeCache,
    episodeCache,
    popularAnimes,
    recentEpisodes,
    trendingAnimes
  } from '$lib/model/cache';
  import { providers, source } from '$lib/model/source';
  import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';
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
    <div class="grid grid-cols-1">
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
      <div class="divider" />
      <button
        class="btn-outline btn-accent btn w-full"
        on:click={async () => {
          const { isPermissionGranted, requestPermission, sendNotification } =
            await import('@tauri-apps/api/notification');
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
</section>
