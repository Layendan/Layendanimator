import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  server: {
    port: 3000,
  },
  plugins: [sveltekit()],
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
};

export default config;
