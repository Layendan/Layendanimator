import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [sveltekit()],
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['vidstack']
  }
};

export default config;
