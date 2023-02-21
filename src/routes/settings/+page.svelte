<script lang="ts">
  import { providers, source } from '$lib/model/source';
  import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
  import Fa from 'svelte-fa';
</script>

<section>
  <h1>Settings</h1>
  <ul>
    <li>
      <a href="/settings/application" class="link link-hover">Application</a>
    </li>
    <li><a href="/settings/app" class="link link-hover">App</a></li>
  </ul>
  <div class="divider" />
  <div class="block dropdown">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <label tabindex="0" class="btn btn-outline btn-accent w-fit">
      Change Source
    </label>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
      tabindex="0"
      class="dropdown-content z-10 p-2 mt-2 shadow bg-base-200 rounded-box w-52"
    >
      {#each $providers as provider}
        <li class="m-1">
          <button
            class="btn btn-outline btn-accent w-full flex flex-row gap-1 text-base-content items-center"
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
    class="card bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80 shadow-xl p-8 max-w-none"
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
