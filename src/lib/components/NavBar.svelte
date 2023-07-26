<script lang="ts">
  import Fa from 'svelte-fa';
  import { faBookmark, faCog } from '@fortawesome/free-solid-svg-icons';
  import SourceButton from './SourceButton.svelte';
  import NavigationComponents from './NavigationComponents.svelte';
  import { type Provider, source as storeSource } from '$lib/model/source';
  import SearchBar from './SearchBar.svelte';

  export let source: Provider;

  function focusMain() {
    const element = document
      .getElementById('main')
      ?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]'
      );
    if (element) {
      (element as HTMLElement).focus();
      scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
</script>

<div
  class="navbar sticky left-0 right-0 top-0 z-50 bg-base-100 bg-opacity-80 backdrop-blur-xl backdrop-filter"
>
  <button
    class="center btn btn-primary pointer-events-none absolute left-2 z-20 justify-center opacity-0 focus-within:pointer-events-auto focus-within:opacity-100"
    on:click={focusMain}
  >
    Skip to main content
  </button>

  <div class="navbar-start flex gap-2">
    <NavigationComponents />

    <a
      href="/{$storeSource.id}"
      class="btn btn-ghost text-xl normal-case"
      aria-label="Home"
    >
      Layendanimator
    </a>

    <SearchBar />
  </div>

  <div class="absolute bottom-2 right-2 top-2 flex gap-2">
    <SourceButton currentSrc={source} />

    <div class="tooltip tooltip-bottom" data-tip="Library">
      <a href="/library" class="btn btn-ghost" aria-label="Library">
        <Fa icon={faBookmark} size="1.2x" />
      </a>
    </div>

    <div
      class="tooltip tooltip-bottom before:left-[calc(50%-0.5rem)]"
      data-tip="Settings"
    >
      <a href="/settings" class="btn btn-ghost" aria-label="Settings">
        <Fa icon={faCog} size="1.2x" />
      </a>
    </div>
  </div>
</div>
