<script lang="ts">
  import { notifications } from '$lib/model/notifications';
  import { settings } from '$lib/model/settings';
  import { createTheme, getHSL, hexToHSL, hslToHex } from '$lib/model/theme';

  let modal: HTMLDialogElement;

  let name = '';
  let isDark = true;
  let primary = '';
  let secondary = '';
  let accent = '';
  let neutral = '';
  let bg = '';
  let info = '';
  let success = '';
  let warning = '';
  let error = '';
</script>

<button class="btn-primary btn my-auto" on:click={() => modal?.showModal()}>
  Create New Theme
</button>
<dialog id="theme-dialog" class="modal" bind:this={modal}>
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

      const theme = createTheme(themeName, isDark ? 'dark' : 'light', {
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
      $settings.themes[theme.name] = theme;
      $settings.theme = theme;

      name = '';
      isDark = true;
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
    <h1 class="mb-4 text-2xl font-bold">Create A New Theme</h1>
    <div class="form-control w-full max-w-xs">
      <label class="label" for="name">
        <span class="label-text">Theme Name</span>
      </label>
      <input
        type="text"
        id="name"
        placeholder="My Theme"
        required
        class="input-bordered input w-full max-w-xs capitalize"
        bind:value={name}
      />

      <div class="form-control mt-1">
        <label class="label cursor-pointer">
          <span class="label-text">Dark Theme</span>
          <input type="checkbox" bind:checked={isDark} class="checkbox" />
        </label>
      </div>

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
        class="input-bordered input-primary input input-sm w-full max-w-xs uppercase"
        bind:value={primary}
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
        class="input-bordered input-secondary input input-sm w-full max-w-xs uppercase"
        bind:value={secondary}
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
        class="input-bordered input-accent input input-sm w-full max-w-xs uppercase"
        bind:value={accent}
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
        class="input-primary input input-sm w-full max-w-xs uppercase"
        bind:value={neutral}
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
        class="input-primary input input-sm w-full max-w-xs uppercase"
        bind:value={bg}
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
        class="input-info input input-sm w-full max-w-xs uppercase"
        bind:value={info}
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
        class="input-success input input-sm w-full max-w-xs uppercase"
        bind:value={success}
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
        class="input-warning input input-sm w-full max-w-xs uppercase"
        bind:value={warning}
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
        class="input-error input input-sm w-full max-w-xs uppercase"
        bind:value={error}
      />
    </div>
    <div class="modal-action">
      <button class="btn">create theme</button>
    </div>
  </form>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
