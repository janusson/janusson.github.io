import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.ericjanusson.ca",
  integrations: [mdx()],

  markdown: unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});
