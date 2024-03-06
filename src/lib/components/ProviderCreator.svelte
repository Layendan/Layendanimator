<script lang="ts">
  import { notifications } from '$lib/model/notifications';
  import {
    source as currentSource,
    isProvider,
    providers,
    type Provider
  } from '$lib/model/source';
  import { encodeName } from '$lib/model/theme';
  import { ResponseType } from '@tauri-apps/api/http';
  import { tick } from 'svelte';

  let modal: HTMLDialogElement;

  let url = '';
  let hidden = true;

  async function createSourceUrl() {
    // Fetch url and parse it to add to sources
    try {
      const { fetch } = await import('@tauri-apps/api/http');

      const response = await fetch<string>(url, {
        method: 'GET',
        timeout: 15,
        responseType: ResponseType.Text
      });

      if (response.status !== 200) {
        throw new Error('Invalid response');
      }

      const source: Provider = await JSON.parse(response.data);

      if (!isProvider(source)) throw new Error('Invalid source');

      if ($providers[source.id]) throw new Error('Source already exists');

      providers.add(source);
      currentSource.set(source);

      modal.close();
    } catch (e) {
      console.error(e);

      notifications.addNotification({
        title: 'Error',
        message: e as string,
        type: 'error'
      });
    }
  }

  async function createSourceFile() {
    try {
      const [{ open }, { downloadDir }, { readTextFile }] = await Promise.all([
        import('@tauri-apps/api/dialog'),
        import('@tauri-apps/api/path'),
        import('@tauri-apps/api/fs')
      ]);

      const result = await open({
        title: 'Select Source File',
        multiple: false,
        filters: [
          {
            name: 'JSON',
            extensions: ['json']
          }
        ],
        defaultPath: await downloadDir()
      });

      if (!result || Array.isArray(result)) return;

      const source: Provider = await JSON.parse(await readTextFile(result));

      if (!isProvider(source)) throw new Error('Invalid source');

      if ($providers[source.id]) throw new Error('Source already exists');

      providers.add(source);
      currentSource.set(source);

      notifications.addNotification({
        title: 'Success',
        message: 'Source added successfully',
        type: 'success'
      });

      modal.close();

      await tick();
      const element = document.getElementById(`${encodeName(source.id)}-info`);
      if (!element) return;

      element.click();
      element.scrollTo({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      notifications.addNotification({
        title: 'Error',
        message: e as string,
        type: 'error'
      });
    }
  }
</script>

<button
  class="btn btn-primary"
  on:click={() => {
    modal.showModal();
    hidden = false;
  }}
>
  Add New Source
</button>
<dialog bind:this={modal} class="modal" on:close={() => (hidden = true)}>
  <form method="dialog" class="modal-box" on:submit={createSourceUrl}>
    <h1 class="mb-4 text-2xl font-bold">Add a New Source</h1>
    <div class="form-control w-full">
      <label class="label" for="url">
        <span class="label-text">Source Url</span>
      </label>
      <input
        type="text"
        id="url"
        placeholder="https://github.com"
        pattern={'(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})'}
        required
        class="input input-bordered input-primary w-full"
        bind:value={url}
        tabindex={hidden ? -1 : 0}
        aria-label="Enter Source URL"
      />
      <div class="modal-action">
        <button class="btn btn-secondary" tabindex={hidden ? -1 : 0}>
          Add Source
        </button>
        <button
          class="btn"
          on:click|preventDefault|stopPropagation={createSourceFile}
          tabindex={hidden ? -1 : 0}
        >
          Add From File
        </button>
      </div>
    </div>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button tabindex="-1">Close</button>
  </form>
</dialog>
