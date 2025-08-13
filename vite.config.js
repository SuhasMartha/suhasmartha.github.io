import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/', // Updated base path for GitHub Pages
  define: {
    global: 'globalThis',
    Buffer: ['buffer', 'Buffer'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['buffer', 'gray-matter'],
  },
});