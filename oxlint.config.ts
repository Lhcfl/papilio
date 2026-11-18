/**
 * SPDX-FileCopyrightText: Linca
 * SPDX-License-Identifier: CC0-1.0
 */
import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'react', 'unicorn'],
  categories: {
    correctness: 'error',
  },
  options: {
    typeAware: true,
  },
  env: {
    builtin: true,
  },
  ignorePatterns: ['dist', 'sharkey-js', 'locales-source', 'src/ui/*.tsx', 'dev-scripts/**/*', '.agents/**/*'],
  overrides: [
    {
      files: ['src/routes/**/*.{ts,tsx}'],
      rules: {
        'react/only-export-components': 'off',
      },
    },
  ],
});
