import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    entries: ['**/*.svelte']
  }
};

export default config;
