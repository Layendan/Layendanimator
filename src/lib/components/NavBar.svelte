<script lang="ts">
  import { page } from '$app/stores';
  import Fa from 'svelte-fa';
  import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
  import {
    faHome,
    faSearch,
    faBookmark,
    faCog
  } from '@fortawesome/free-solid-svg-icons';

  type Route = {
    href: string;
    icon: IconDefinition;
    active?: (href: string | null) => boolean;
  };
  const navRoutes: Route[] = [
    {
      href: '/',
      active: (href: string | null) => {
        if (!href) return false;
        const result =
          href === '/' || href === '/[id]' || href === '/[id]/[episode]';
        return result;
      },
      icon: faHome
    },
    { href: '/search', icon: faSearch },
    { href: '/library', icon: faBookmark },
    { href: '/settings', icon: faCog }
  ];
</script>

<div class="btm-nav btm-nav-sm backdrop-filter backdrop-blur-xl bg-opacity-60">
  {#each navRoutes as { href, active, icon }}
    <a
      {href}
      class={`rounded-md p-2 px-12 bg-base-content 
      ${
        active
          ? // If function was provided
            active($page.route.id)
            ? 'bg-opacity-100 text-base-300'
            : 'bg-opacity-0'
          : // Otherwise this
          $page.route.id === href
          ? 'bg-opacity-100 text-base-300'
          : 'bg-opacity-0'
      }
      `}
    >
      <Fa {icon} />
    </a>
  {/each}
</div>
