module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 80,
  svelteStrictMode: false,
  arrowParens: 'avoid',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
