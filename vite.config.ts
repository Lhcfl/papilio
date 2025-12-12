import path from 'node:path';
import TailWindCSS from '@tailwindcss/vite';
import TanStackRouter from '@tanstack/router-plugin/vite';
import React from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { visualizer as Visualizer } from 'rollup-plugin-visualizer';
import PackageJSON from './package.json';
import { env } from 'node:process';
import { exec } from 'node:child_process';
import { promisify } from 'util';
import { PapilioI18nGenerator } from './vite-plugins/locales-generator';

const execAsync = promisify(exec);

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(PackageJSON.version),
    __APP_REPO__: JSON.stringify(PackageJSON.repository.url),
    __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __APP_COMMIT_HASH__: JSON.stringify(
      await execAsync('git rev-parse --short HEAD')
        .then((res) => res.stdout.trim())
        .catch(() => 'unknown'),
    ),
  },
  plugins: [
    PapilioI18nGenerator(),
    TailWindCSS(),
    TanStackRouter({
      autoCodeSplitting: true,
    }),
    React({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            env.DEBUG_REACT_COMPILER === 'true'
              ? {
                  panicThreshold: 'all_errors',
                }
              : {},
          ],
        ],
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
    ...(env.DEBUG_NO_MINIFY === 'true' ? { minify: false } : {}),
  },
});
