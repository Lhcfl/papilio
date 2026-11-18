/**
 * SPDX-FileCopyrightText: Linca
 * SPDX-License-Identifier: CC0-1.0
 */
import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 120,
  singleQuote: true,
  ignorePatterns: [
    '.agents/**',
    'pnpm-lock.yaml',
    'dist/**',
    'sharkey-js/**',
    'locales-source/**',
    'src/ui/**',
    'src/routeTree.gen.ts',
    'src/assets/langs.json',
    'src/assets/emojilist.json',
  ],
});
