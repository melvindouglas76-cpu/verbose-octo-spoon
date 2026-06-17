import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages project hosting. If you connect a custom domain,
  // this can be changed to '/'.
  base: '/verbose-octo-spoon/',
});
