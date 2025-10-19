import path from 'node:path';
import TailWindCSS from '@tailwindcss/vite';
import TanStackRouter from '@tanstack/router-plugin/vite';
import React from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer as Visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TailWindCSS(),
    TanStackRouter({
      autoCodeSplitting: true,
    }),
    React({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    Visualizer({ filename: 'dist/visual.html' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // We increase the chunk size warning limit because shiki can generate some large language defination chunks.
    chunkSizeWarningLimit: 800,
  },
});
