<script lang="ts">
  import { notifications } from '$lib/model/notifications';
  import { settings } from '$lib/model/settings';
  import {
    OKLCHToHex,
    createTheme,
    getOklch,
    hexToOklch,
    hslToOklch,
    isHSL,
    type CSSInput,
    type Theme
  } from '$lib/model/theme';
  import type { Oklch } from 'culori';

  let modal: HTMLDialogElement;
  let hidden = true;

  let name = '';
  let primary = $settings.theme.css
    ? OKLCHToHex($settings.theme.css.p)
    : '#661AE6';
  let secondary = $settings.theme.css
    ? OKLCHToHex($settings.theme.css.s)
    : '#D926AA';
  let accent = $settings.theme.css
    ? OKLCHToHex($settings.theme.css.a)
    : '#1FB2A5';
  let neutral = $settings.theme.css
    ? OKLCHToHex($settings.theme.css.n)
    : '#2A323C';
  let bg = $settings.theme.css ? OKLCHToHex($settings.theme.css.b1) : '#1D232A';
  let info = $settings.theme.css?.in
    ? OKLCHToHex($settings.theme.css.in)
    : '#3ABFF8';
  let success = $settings.theme.css?.su
    ? OKLCHToHex($settings.theme.css.su)
    : '#36D399';
  let warning = $settings.theme.css?.wa
    ? OKLCHToHex($settings.theme.css.wa)
    : '#FBBD23';
  let error = $settings.theme.css?.er
    ? OKLCHToHex($settings.theme.css.er)
    : '#F87272';

  const testHex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

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

      if (
        !theme.css.p ||
        !theme.css.s ||
        !theme.css.a ||
        !theme.css.n ||
        !theme.css.b1
      ) {
        throw new Error('Missing Theme Colors');
      }

      const newTheme = createTheme(
        theme.name,
        Object.entries(theme.css).reduce(
          (acc, [key, value]) => {
            acc[key] = isHSL(value)
              ? hslToOklch(value)
              : {
                  mode: 'oklch',
                  ...value
                };
            return acc;
          },
          {} as Record<string, Oklch>
        ) as Partial<CSSInput> & Pick<CSSInput, 'p' | 's' | 'a' | 'n' | 'b1'>
      );

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
        p: hexToOklch(primary),
        s: hexToOklch(secondary),
        a: hexToOklch(accent),
        n: hexToOklch(neutral),
        b1: hexToOklch(bg),
        in: info ? hexToOklch(info) : undefined,
        su: success ? hexToOklch(success) : undefined,
        wa: warning ? hexToOklch(warning) : undefined,
        er: error ? hexToOklch(error) : undefined
      });
      $settings.themes[themeName] = theme;
      $settings.theme = theme;

      name = '';
      primary = $settings.theme.css
        ? OKLCHToHex($settings.theme.css.p)
        : '#661AE6';
      secondary = $settings.theme.css
        ? OKLCHToHex($settings.theme.css.s)
        : '#D926AA';
      accent = $settings.theme.css
        ? OKLCHToHex($settings.theme.css.a)
        : '#1FB2A5';
      neutral = $settings.theme.css
        ? OKLCHToHex($settings.theme.css.n)
        : '#2A323C';
      bg = $settings.theme.css ? OKLCHToHex($settings.theme.css.b1) : '#1D232A';
      info = $settings.theme.css?.in
        ? OKLCHToHex($settings.theme.css.in)
        : '#3ABFF8';
      success = $settings.theme.css?.su
        ? OKLCHToHex($settings.theme.css.su)
        : '#36D399';
      warning = $settings.theme.css?.wa
        ? OKLCHToHex($settings.theme.css.wa)
        : '#FBBD23';
      error = $settings.theme.css?.er
        ? OKLCHToHex($settings.theme.css.er)
        : '#F87272';
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
        class="input input-bordered w-full capitalize"
        bind:value={name}
        tabindex={hidden ? -1 : 0}
        aria-label="Enter Theme Name"
      />

      <label class="label" for="primary">
        <span class="label-text">Primary Color</span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={primary}
        />
        <input
          type="text"
          id="primary"
          placeholder={$settings.theme.css
            ? OKLCHToHex($settings.theme.css.p)
            : '#661AE6'}
          required
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--p={testHex.test(primary)
            ? getOklch(hexToOklch(primary))
            : 'var(--primary)'}
          class="input input-sm input-bordered input-primary w-full uppercase"
          bind:value={primary}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="secondary">
        <span class="label-text">Secondary Color</span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={secondary}
        />
        <input
          type="text"
          id="secondary"
          placeholder={$settings.theme.css
            ? OKLCHToHex($settings.theme.css.s)
            : '#D926AA'}
          required
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--s={testHex.test(secondary)
            ? getOklch(hexToOklch(secondary))
            : 'var(--secondary)'}
          class="input input-sm input-bordered input-secondary w-full uppercase"
          bind:value={secondary}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="accent">
        <span class="label-text">Accent Color</span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={accent}
        />
        <input
          type="text"
          id="accent"
          placeholder={$settings.theme.css
            ? OKLCHToHex($settings.theme.css.a)
            : '#1FB2A5'}
          required
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--a={testHex.test(accent)
            ? getOklch(hexToOklch(accent))
            : 'var(--accent)'}
          class="input input-sm input-bordered input-accent w-full uppercase"
          bind:value={accent}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="neutral">
        <span class="label-text">Neutral Color</span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={neutral}
        />
        <input
          type="text"
          id="neutral"
          placeholder={$settings.theme.css
            ? OKLCHToHex($settings.theme.css.n)
            : '#2A323C'}
          required
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--p={testHex.test(neutral)
            ? getOklch(hexToOklch(neutral))
            : 'var(--neutral)'}
          class="input input-sm input-primary w-full uppercase"
          bind:value={neutral}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="bg">
        <span class="label-text">Background Color</span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={bg}
        />
        <input
          type="text"
          id="bg"
          placeholder={$settings.theme.css
            ? OKLCHToHex($settings.theme.css.b1)
            : '#1D232A'}
          required
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--p={testHex.test(bg) ? getOklch(hexToOklch(bg)) : 'var(--bg)'}
          class="input input-sm input-primary w-full uppercase"
          bind:value={bg}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="info">
        <span class="label-text">
          Info Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={info}
        />
        <input
          type="text"
          id="info"
          placeholder={$settings.theme.css?.in
            ? OKLCHToHex($settings.theme.css.in)
            : '#3ABFF8'}
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--in={testHex.test(info)
            ? getOklch(hexToOklch(info))
            : 'var(--info)'}
          class="input input-sm input-info w-full uppercase"
          bind:value={info}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="success">
        <span class="label-text">
          Success Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={success}
        />
        <input
          type="text"
          id="success"
          placeholder={$settings.theme.css?.su
            ? OKLCHToHex($settings.theme.css.su)
            : '#36D399'}
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--su={testHex.test(success)
            ? getOklch(hexToOklch(success))
            : 'var(--success)'}
          class="input input-sm input-success w-full uppercase"
          bind:value={success}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="warning">
        <span class="label-text">
          Warning Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={warning}
        />
        <input
          type="text"
          id="warning"
          placeholder={$settings.theme.css?.wa
            ? OKLCHToHex($settings.theme.css.wa)
            : '#FBBD23'}
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--wa={testHex.test(warning)
            ? getOklch(hexToOklch(warning))
            : 'var(--warning)'}
          class="input input-sm input-warning w-full uppercase"
          bind:value={warning}
          tabindex={hidden ? -1 : 0}
        />
      </span>

      <label class="label" for="error">
        <span class="label-text">
          Error Color <i class="text-xs">(optional)</i>
        </span>
      </label>
      <span class="inline-flex items-center gap-2">
        <input
          type="color"
          class="aspect-square h-8 w-8 cursor-pointer rounded-lg bg-transparent"
          bind:value={error}
        />
        <input
          type="text"
          id="error"
          placeholder={$settings.theme.css?.er
            ? OKLCHToHex($settings.theme.css.er)
            : '#F87272'}
          pattern={'^#(?:[0-9a-fA-F]{3}){1,2}$'}
          style:--er={testHex.test(error)
            ? getOklch(hexToOklch(error))
            : 'var(--error)'}
          class="input input-sm input-error w-full uppercase"
          bind:value={error}
          tabindex={hidden ? -1 : 0}
        />
      </span>
    </div>

    <div class="modal-action">
      <button class="btn btn-secondary" tabindex={hidden ? -1 : 0}>
        Create Theme
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
