import path from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@d': path.resolve(__dirname, 'src/domains'),
      '@api': path.resolve(__dirname, 'src/shared/api'),
      '@ui': path.resolve(__dirname, 'src/shared/ui'),
      '@lib': path.resolve(__dirname, 'src/shared/lib'),
      '@config': path.resolve(__dirname, 'src/shared/config')
    }
  }
});
