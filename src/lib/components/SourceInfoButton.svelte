<script lang="ts">
  import { createSourceContextMenu } from '$lib/model/contextmenu';
  import { notifications } from '$lib/model/notifications';
  import {
    checkUpdate,
    source as currentSource,
    defaultProviders,
    providers,
    type Provider
  } from '$lib/model/source';
  import { encodeName } from '$lib/model/theme';
  import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
  import { showMenu } from 'tauri-plugin-context-menu';
  import SourceContextMenu from './SourceContextMenu.svelte';

  export let source: Provider;

  let modal: HTMLDialogElement;
  let hidden = true;

  let name = source.name;
  let url = source.url;
  let updateUrl = source.updateUrl;
  let logo = source.logo;
  let version = source.version;
  let description = source.description;

  let element: HTMLElement;

  function contextMenu() {
    if (window.__TAURI__) {
      showMenu({
        items: createSourceContextMenu(source)
      });
    }
  }
</script>

<button
  class="btn"
  id="{encodeName(source.id)}-info"
  on:click={() => {
    modal.showModal();
    hidden = false;
  }}
  on:contextmenu|stopPropagation|preventDefault={contextMenu}
  bind:this={element}
  aria-label="{source.name} Source Information"
>
  <img src={source.logo} alt={source.name} class="mr-2 h-6 w-6 rounded-md" />
  {source.name}
</button>
<dialog
  bind:this={modal}
  class="modal modal-bottom"
  on:close={() => (hidden = true)}
>
  <form
    method="dialog"
    class="modal-box"
    on:submit={() => {
      const newSource = {
        ...source,
        name,
        url,
        updateUrl,
        logo,
        description
      };
      providers.add(newSource);
      if ($currentSource.id === source.id) {
        currentSource.set(newSource);
      }

      notifications.addNotification({
        title: 'Success',
        message: 'Source updated successfully',
        type: 'success'
      });

      modal.close();
    }}
  >
    <h1 class="text-2xl font-bold capitalize">{source.name}</h1>
    <span class="inline-flex flex-wrap gap-1">
      {#each source.tags as tag}
        <span class="badge badge-neutral lowercase">{tag}</span>
      {/each}
      {#each source.languages as language}
        <span class="badge badge-neutral lowercase">{language}</span>
      {/each}
      <span
        class="badge lowercase"
        class:badge-success={source.status === 'working'}
        class:badge-error={source.status === 'broken'}
      >
        {source.status}
      </span>
      {#if source.isNSFW}
        <span class="badge badge-error lowercase">18+</span>
      {/if}
      {#if defaultProviders[source.id]}
        <span class="badge badge-warning lowercase">Default Source</span>
      {/if}
    </span>
    {#if source.externalLinks}
      <span class="mt-1 flex flex-wrap gap-1">
        {#each source.externalLinks as [name, url]}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm"
            tabindex={hidden ? -1 : 0}
          >
            {name}
          </a>
        {/each}
      </span>
    {/if}

    <div class="form-control mt-4 w-full">
      <label class="label" for="name">
        <span class="label-text">Name</span>
      </label>
      <input
        type="text"
        id="name"
        placeholder="No Name"
        disabled={!!defaultProviders[source.id]}
        class="input input-bordered w-full"
        bind:value={name}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="updateUrl">
        <span class="label-text">Update Url</span>
      </label>
      <input
        type="url"
        id="updateUrl"
        placeholder="No Update Url"
        disabled={!!defaultProviders[source.id]}
        class="input input-bordered w-full"
        bind:value={updateUrl}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="url">
        <span class="label-text">Url</span>
      </label>
      <input
        type="url"
        id="url"
        placeholder="No Url"
        disabled={!!defaultProviders[source.id]}
        class="input input-bordered w-full"
        bind:value={url}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="icon">
        <span class="label-text">Icon</span>
      </label>
      <input
        type="url"
        id="icon"
        placeholder="No Icon"
        disabled={!!defaultProviders[source.id]}
        class="input input-bordered w-full"
        bind:value={logo}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="description">
        <span class="label-text">Description</span>
      </label>
      <textarea
        id="description"
        placeholder="No Description"
        disabled={!!defaultProviders[source.id]}
        class="textarea textarea-bordered w-full resize-none"
        bind:value={description}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="version">
        <span class="label-text">Version</span>
      </label>
      <input
        type="text"
        id="version"
        placeholder="No Version"
        disabled={!!defaultProviders[source.id]}
        class="input input-bordered w-full"
        bind:value={version}
        tabindex={hidden ? -1 : 0}
      />

      {#if source.updateUrl}
        <label class="label" for="links">
          <span class="label-text">Check for Updates</span>
        </label>
        <button
          class="btn btn-outline btn-primary w-fit"
          on:click|preventDefault|stopPropagation={() => checkUpdate(source)}
          tabindex={hidden ? -1 : 0}
        >
          <Fa icon={faCloudArrowDown} />
          Check for Updates
        </button>
      {/if}

      {#if !defaultProviders[source.id]}
        <div class="modal-action">
          <button class="btn btn-secondary">Update Source</button>
          <button
            class="btn btn-outline btn-error"
            on:click|preventDefault|stopPropagation={async () => {
              const { confirm } = await import('@tauri-apps/api/dialog');
              const confirmed = await confirm(
                'This action cannot be reverted. Are you sure?',
                {
                  title: 'Delete Source',
                  type: 'warning',
                  okLabel: "Yes, I'm Sure"
                }
              );
              if (confirmed) {
                providers.remove(source);
                notifications.addNotification({
                  title: 'Success',
                  message: 'Source deleted successfully',
                  type: 'success'
                });
              }
            }}
            tabindex={hidden ? -1 : 0}
          >
            Delete Source
          </button>
        </div>
      {/if}
    </div>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button tabindex="-1">close</button>
  </form>
</dialog>

{#if !window.__TAURI__}
  <SourceContextMenu provider={source} {element} />
{/if}
