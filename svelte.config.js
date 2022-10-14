import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    typescript: {
      tsconfigFile: "./tsconfig.json",
    },
  }),

  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      // Tauri expects index.html, not app.html
      fallback: "index.html",
    }),
    prerender: {
      entries: [],
    },
  },
};

export default config;
