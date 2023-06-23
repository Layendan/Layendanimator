const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('vidstack/tailwind.cjs'),
    require('tailwindcss-scoped-groups')({
      groups: ['one']
    }),
    plugin(function ({ matchUtilities, theme }) {
      // https://stackoverflow.com/a/73165741
      matchUtilities(
        {
          'translate3d-x': value => ({
            '--tw-translate-x': value,
            '--tw-translate-x': 0,
            '--tw-translate-y': 0,
            transform: `translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`
          }),
          'translate3d-y': value => ({
            '--tw-translate-x': 0,
            '--tw-translate-y': value,
            '--tw-translate-z': 0,
            transform: `translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`
          }),
          'translate3d-z': value => ({
            '--tw-translate-x': 0,
            '--tw-translate-y': 0,
            '--tw-translate-z': value,
            transform: `translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`
          })
        },
        { values: theme('translate'), supportsNegativeValues: true }
      );
    })
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          to: {
            'background-position-x': '-200%;'
          }
        }
      },
      animation: {
        'loading-card': 'shine 1.5s linear infinite'
      }
    }
  },
  daisyui: {
    themes: false
  }
};
