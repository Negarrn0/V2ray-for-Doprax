import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The production build is ONE self-contained HTML file (JS, CSS and fonts inlined),
// so the board can be copied to a USB stick / media player / TV browser and run offline.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
