/**
 * SPDX-FileCopyrightText: Linca
 * SPDX-License-Identifier: CC0-1.0
 */
import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'react', 'unicorn', 'jsx-a11y', 'promise'],
  categories: {
    correctness: 'error',
    perf: 'error',
  },
  options: {
    typeAware: true,
  },
  env: {
    builtin: true,
  },
  ignorePatterns: ['dist', 'sharkey-js', 'locales-source', 'src/ui/*.tsx', 'dev-scripts/**/*', '.agents/**/*'],
  rules: {
    'react/exhaustive-deps': 'warn',
    'typescript/ban-ts-comment': [
      'error',
      {
        'ts-check': false,
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
      },
    ],
    'typescript/no-explicit-any': 'error',
    // Base UI 的 `render={<button />}` 把 label 传给包装组件的 children，规则看不穿这层，项目内 10 处全是这一模式的误报。
    'jsx-a11y/control-has-associated-label': 'off',
  },
});
