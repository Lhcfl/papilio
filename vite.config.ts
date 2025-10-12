import path from 'node:path';
import TailWindCSS from '@tailwindcss/vite';
import TanStackRouter from '@tanstack/router-plugin/vite';
import React from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TailWindCSS(),
    TanStackRouter({
      autoCodeSplitting: true,
    }),
    React(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
