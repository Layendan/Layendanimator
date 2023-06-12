<script lang="ts">
  import Fa from 'svelte-fa';
  import { faBookmark, faCog } from '@fortawesome/free-solid-svg-icons';
  import SourceButton from './SourceButton.svelte';
  import SearchBar from './SearchBar.svelte';
  import NavigationComponents from './NavigationComponents.svelte';
</script>

<div
  class="navbar sticky left-0 right-0 top-0 z-50 bg-base-100 bg-opacity-80 backdrop-blur-xl backdrop-filter"
>
  <a
    class="center btn-primary btn absolute left-2 hidden justify-center opacity-0 focus-visible:block"
    href="#main"
  >
    Go to main content
  </a>

  <div class="navbar-start flex gap-2">
    <NavigationComponents />

    <a href="/" class="btn-ghost btn text-xl normal-case" aria-label="Home">
      Layendanimator
    </a>

    <SearchBar />
  </div>

  <div class="absolute bottom-2 right-2 top-2 flex gap-2">
    <SourceButton />

    <div class="tooltip tooltip-bottom" data-tip="Library">
      <a href="/library" class="btn-ghost btn" aria-label="Library">
        <Fa icon={faBookmark} size="1.2x" />
      </a>
    </div>

    <div
      class="tooltip tooltip-bottom before:left-[calc(50%-0.5rem)]"
      data-tip="Settings"
    >
      <a href="/settings" class="btn-ghost btn" aria-label="Settings">
        <Fa icon={faCog} size="1.2x" />
      </a>
    </div>
  </div>
</div>
