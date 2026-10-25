# separator

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/separator.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Base UI `Separator` is a callable primitive; `decorative` was dropped.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/separator.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/menu-or-drawer.tsx`
  - `src/components/mk-emoji-picker.tsx`
  - `src/components/mk-user-card.tsx`
  - `src/components/settings/profile/profile-base-info-edit.tsx`
  - `src/routes/about/instance.tsx`
  - `src/routes/search/note.tsx`
  - `src/routes/search/user.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

`decorative` removed; separators now always expose role semantics from Base UI.

## Verify by hand

Separators between menu groups/settings cards still render 1px lines horizontally and vertically.
