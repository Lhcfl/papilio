# AGENTS

- Use `pnpm install` to install deps; or `bun` as an alternative.
- Dev server: `pnpm dev` (runs `vite`). Build: `pnpm build`.
- Typecheck: `pnpm typecheck` (runs `tsgo -b --noEmit`).
- Lint: `pnpm lint` and auto-fix: `pnpm lint:fix`.
- Pre-commit hooks run `pnpm test:pre-commit` and pre-push runs `pnpm test:pre-push`.
- Single-test guidance: there are no unit-test frameworks configured; run targeted scripts or add `vitest` and use `pnpm vitest <file>`.

Code style (follow strictly):

- Formatting: Prettier with `prettier-plugin-tailwindcss`; config enforced via ESLint `prettier/prettier` rule (printWidth=120, tabWidth=2, singleQuote=true, semi=true, trailingComma=all, endOfLine=lf).
- ESLint: follow project ESLint config in `eslint.config.js` (TypeScript strict/type-checked rules enabled). Use `pnpm lint` before PRs.
- Imports: use absolute `@/` imports where existing (e.g. `@/components/...`). Prefer explicit named imports; keep import groups consistent (external -> src alias -> local).
- TypeScript: prefer strict typing and `ts-expect-error` only when necessary; `@typescript-eslint/no-non-null-assertion` is disabled in config, but avoid `!` unless justified.
- Naming: use descriptive camelCase for variables and PascalCase for React components.
- Error handling: use `react-error-boundary` for top-level components; prefer returning explicit `null` or error UI over swallowing errors.
- Tests: add tests with `vitest` and follow existing patterns; if adding tests, include a script `test` and a `test:single` helper if needed.

Other notes:

- Husky hooks are active (`.husky/`); commit messages are formatted by `dev-scripts/commit-message-format.js`.
- No `.cursor` or Copilot instructions detected; nothing to include for Cursor/Copilot rules.

Keep changes minimal and run `pnpm lint` and `pnpm typecheck` before submitting PRs.
