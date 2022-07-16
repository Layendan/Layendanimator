import { sveltekit } from "@sveltejs/kit/vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

/** @type {import('vite').UserConfig} */
const config = {
  server: {
    port: 3000,
  },
  plugins: [sveltekit(), rollupNodePolyFill()],
  resolve: {
    alias: {
      path: "rollup-plugin-node-polyfills/polyfills/path",
    },
  },
};

export default config;
