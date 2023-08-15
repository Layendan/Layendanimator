<script lang="ts">
  import { notifications } from '$lib/model/notifications';
  import { settings } from '$lib/model/settings';
  import {
    createTheme,
    getHSL,
    hexToHSL,
    hslToHex,
    type Theme
  } from '$lib/model/theme';

  let modal: HTMLDialogElement;
  let hidden = true;

  let name = '';
  let primary = '';
  let secondary = '';
  let accent = '';
  let neutral = '';
  let bg = '';
  let info = '';
  let success = '';
  let warning = '';
  let error = '';

  async function createThemeFromFile() {
    try {
      const [{ open }, { downloadDir }, { readTextFile }] = await Promise.all([
        import('@tauri-apps/api/dialog'),
        import('@tauri-apps/api/path'),
        import('@tauri-apps/api/fs')
      ]);

      const filePath = await open({
        title: 'Export Theme',
        filters: [{ name: 'JSON', extensions: ['json'] }],
        multiple: false,
        defaultPath: await downloadDir()
      });

      if (!filePath || Array.isArray(filePath)) return;

      const text = await readTextFile(filePath);

      const theme: Theme = await JSON.parse(text);

      if (!theme.name || !theme.css) {
        throw new Error('Invalid theme');
      }

      if ($settings.themes[theme.name]) {
        throw new Error('Theme already exists');
      }

      const newTheme = createTheme(theme.name, theme.css);

      $settings.themes[theme.name] = newTheme;
      $settings.theme = newTheme;

      notifications.addNotification({
        title: 'Imported Successful',
        message: `Successfully imported ${theme.name} from ${filePath}`,
        type: 'success'
      });

      modal.close();
    } catch (e) {
      notifications.addNotification({
        title: 'Import Failed',
        message: e as string,
        type: 'error'
      });
    }
  }
</script>

<button
  class="btn btn-primary my-auto"
  on:click={() => {
    modal.showModal();
    hidden = false;
  }}
>
  Create New Theme
</button>
<dialog
  id="theme-dialog"
  class="modal"
  bind:this={modal}
  on:close={() => (hidden = true)}
>
  <form
    method="dialog"
    class="modal-box"
    style:--primary="var(--p)"
    style:--secondary="var(--s)"
    style:--accent="var(--a)"
    style:--neutral="var(--n)"
    style:--bg="var(--b1)"
    style:--info="var(--in)"
    style:--success="var(--su)"
    style:--warning="var(--wa)"
    style:--error="var(--er)"
    on:submit={() => {
      const themeName = name.toLowerCase();

      if ($settings.themes[themeName]) {
        notifications.addNotification({
          title: 'Theme Already Exists',
          message: `A theme with the name "${themeName}" already exists.`,
          type: 'error'
        });
        return;
      }

      const theme = createTheme(themeName, {
        p: hexToHSL(primary),
        s: hexToHSL(secondary),
        a: hexToHSL(accent),
        n: hexToHSL(neutral),
        b1: hexToHSL(bg),
        in: info ? hexToHSL(info) : undefined,
        su: success ? hexToHSL(success) : undefined,
        wa: warning ? hexToHSL(warning) : undefined,
        er: error ? hexToHSL(error) : undefined
      });
      $settings.themes[themeName] = theme;
      $settings.theme = theme;

      name = '';
      primary = '';
      secondary = '';
      accent = '';
      neutral = '';
      bg = '';
      info = '';
      success = '';
      warning = '';
      error = '';
    }}
  >
    <h1 class="mb-4 text-2xl font-bold">Create a New Theme</h1>
    <div class="form-control w-full">
      <label class="label" for="name">
        <span class="label-text">Theme Name</span>
      </label>
      <input
        type="text"
        id="name"
        placeholder="My Theme"
        required
        class="input input-bordered w-full capitalize transition-colors duration-200"
        bind:value={name}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="primary">
        <span class="label-text">Primary Color</span>
      </label>
      <input
        type="text"
        id="primary"
        placeholder={$settings.theme.css
          ? hslToHex($settings.theme.css.p)
          : '#661AE6'}
        required
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--p={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(primary)
          ? getHSL(hexToHSL(primary))
          : 'var(--primary)'}
        class="input input-bordered input-primary input-sm w-full uppercase transition-colors duration-200"
        bind:value={primary}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="secondary">
        <span class="label-text">Secondary Color</span>
      </label>
      <input
        type="text"
        id="secondary"
        placeholder={$settings.theme.css
          ? hslToHex($settings.theme.css.s)
          : '#D926AA'}
        required
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--s={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(secondary)
          ? getHSL(hexToHSL(secondary))
          : 'var(--secondary)'}
        class="input input-bordered input-secondary input-sm w-full uppercase transition-colors duration-200"
        bind:value={secondary}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="accent">
        <span class="label-text">Accent Color</span>
      </label>
      <input
        type="text"
        id="accent"
        placeholder={$settings.theme.css
          ? hslToHex($settings.theme.css.a)
          : '#1FB2A5'}
        required
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--a={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(accent)
          ? getHSL(hexToHSL(accent))
          : 'var(--accent)'}
        class="input input-bordered input-accent input-sm w-full uppercase transition-colors duration-200"
        bind:value={accent}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="neutral">
        <span class="label-text">Neutral Color</span>
      </label>
      <input
        type="text"
        id="neutral"
        placeholder={$settings.theme.css
          ? hslToHex($settings.theme.css.n)
          : '#2A323C'}
        required
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--p={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(neutral)
          ? getHSL(hexToHSL(neutral))
          : 'var(--neutral)'}
        class="input input-primary input-sm w-full uppercase transition-colors duration-200"
        bind:value={neutral}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="bg">
        <span class="label-text">Background Color</span>
      </label>
      <input
        type="text"
        id="bg"
        placeholder={$settings.theme.css
          ? hslToHex($settings.theme.css.b1)
          : '#1D232A'}
        required
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--p={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(bg)
          ? getHSL(hexToHSL(bg))
          : 'var(--bg)'}
        class="input input-primary input-sm w-full uppercase transition-colors duration-200"
        bind:value={bg}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="info">
        <span class="label-text">
          Info Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <input
        type="text"
        id="info"
        placeholder={$settings.theme.css?.in
          ? hslToHex($settings.theme.css.in)
          : '#3ABFF8'}
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--in={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(info)
          ? getHSL(hexToHSL(info))
          : 'var(--info)'}
        class="input input-info input-sm w-full uppercase transition-colors duration-200"
        bind:value={info}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="success">
        <span class="label-text">
          Success Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <input
        type="text"
        id="success"
        placeholder={$settings.theme.css?.su
          ? hslToHex($settings.theme.css.su)
          : '#36D399'}
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--su={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(success)
          ? getHSL(hexToHSL(success))
          : 'var(--success)'}
        class="input input-success input-sm w-full uppercase transition-colors duration-200"
        bind:value={success}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="warning">
        <span class="label-text">
          Warning Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <input
        type="text"
        id="warning"
        placeholder={$settings.theme.css?.wa
          ? hslToHex($settings.theme.css.wa)
          : '#FBBD23'}
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--wa={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(warning)
          ? getHSL(hexToHSL(warning))
          : 'var(--warning)'}
        class="input input-warning input-sm w-full uppercase transition-colors duration-200"
        bind:value={warning}
        tabindex={hidden ? -1 : 0}
      />

      <label class="label" for="error">
        <span class="label-text">
          Error Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <input
        type="text"
        id="error"
        placeholder={$settings.theme.css?.er
          ? hslToHex($settings.theme.css.er)
          : '#F87272'}
        pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
        style:--er={/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(error)
          ? getHSL(hexToHSL(error))
          : 'var(--error)'}
        class="input input-error input-sm w-full uppercase transition-colors duration-200"
        bind:value={error}
        tabindex={hidden ? -1 : 0}
      />
    </div>
    <div class="modal-action">
      <button class="btn btn-secondary" tabindex={hidden ? -1 : 0}>
        create theme
      </button>
      <button
        class="btn"
        on:click|preventDefault|stopPropagation={createThemeFromFile}
        tabindex={hidden ? -1 : 0}
      >
        Add From File
      </button>
    </div>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button tabindex="-1">close</button>
  </form>
</dialog>
