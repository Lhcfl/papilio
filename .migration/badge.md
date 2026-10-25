# badge

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/badge.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Registry wrapper now built on `useRender` + `mergeProps`; `asChild` replaced by `render`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/badge.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/file/mk-drive-file.tsx`
  - `src/components/user/mk-user-badges.tsx`
  - `src/routes/my/drive/file.$file/index.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

None beyond the API rename.

## Verify by hand

Badges in settings and profile render with the right variant colours; any link-badge still navigates.
