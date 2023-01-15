const path = require('node:path');

module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 80,
  svelteStrictMode: true,
  arrowParens: 'avoid',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  plugins: ['prettier-plugin-svelte'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
  pluginSearchDirs: [path.join(__dirname, './')]
};
