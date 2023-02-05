import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base:'/',
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from two level up to the project root (for shared folder)
      allow: ['../..'],
    },
  },
})
