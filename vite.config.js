import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from '@mdx-js/rollup';
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    tailwindcss(),
    mdx(),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/data/posts/*.md",
          dest: "data/posts"           
        }
      ]
    })
  ],
  base: '/', 
  define: {
    global: "globalThis",
    Buffer: ["buffer", "Buffer"],
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: ["buffer", "gray-matter"],
  }
});