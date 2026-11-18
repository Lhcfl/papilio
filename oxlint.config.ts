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
    suspicious: 'error',
  },
  options: {
    typeAware: true,
  },
  env: {
    builtin: true,
  },
  ignorePatterns: [
    'dist',
    'sharkey-js',
    'locales-source',
    'src/ui/*.tsx',
    'dev-scripts/**/*',
    '.agents/**/*',
    '.husky/**',
  ],
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
    // React 17+ 的自动 JSX runtime 不需要在作用域内引入 React，这条规则已废弃。
    'react/react-in-jsx-scope': 'off',
    // Worker 的 postMessage 没有 targetOrigin 参数，该规则只适用于 window.postMessage。
    'unicorn/require-post-message-target-origin': 'off',
    // 项目里的 `as` 全是有意收窄（Object.keys、模板字面量类型、Base UI render prop、未类型化响应边界），
    // 该规则在此代码库中的 102 条命中没有一条是意外收窄，见 PR 讨论。
    'typescript/no-unsafe-type-assertion': 'off',
    // 外部约定好的名字：Vite define、TanStack Query 的全局挂载点、locale 数据字段。
    'eslint/no-underscore-dangle': [
      'error',
      {
        allow: [
          '__APP_VERSION__',
          '__APP_REPO__',
          '__APP_BUILD_DATE__',
          '__APP_COMMIT_HASH__',
          '__TANSTACK_QUERY_CLIENT__',
          '_lang_',
        ],
      },
    ],
    // 渲染函数作为 prop 传入（`icon`、`fallbackRender`）由库按普通函数调用，不构成组件边界。
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    // 内层同名变量（`site`、`token`、`id`）在这个代码库里很常见，遮蔽不构成实际问题。
    'eslint/no-shadow': 'off',
    // 规则建议的 `toSorted` 是 ES2023，项目 lib 为 ES2022，因此放行复制后排序。
    'unicorn/no-array-sort': ['error', { allowAfterSpread: true }],
    // 项目里 switch 普遍用 default 兜底（未识别的通知类型退回通用渲染），带 default 的 switch 视为已穷尽。
    'typescript/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
    'eslint/require-unicode-regexp': 'error',
    // `smart` 放行 `== null`（同时判断 null 与 undefined 的惯用写法）与同类字面量比较。
    'eslint/eqeqeq': ['error', 'smart'],
  },
});
