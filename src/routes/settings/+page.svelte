<script lang="ts">
  import { providers, source } from '$lib/model/source';
  import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';
</script>

<section>
  <h1>Settings</h1>
  <ul>
    <li>
      <a href="/settings/application" class="link-hover link">Application</a>
    </li>
    <li><a href="/settings/app" class="link-hover link">App</a></li>
  </ul>
  <div class="divider" />
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
  <section
    class="card max-w-none bg-base-200 bg-opacity-80 bg-clip-padding p-8 shadow-xl backdrop-blur-xl backdrop-filter"
  >
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
  </section>
</section>
