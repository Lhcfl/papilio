# checkbox

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/checkbox.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). 1:1 wrapper on `@base-ui/react/checkbox`; checkmark is a lucide `CheckIcon`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/checkbox.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/routes/my/relations/-common.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

`checked="indeterminate"` is replaced by a separate `indeterminate` boolean. No call site used indeterminate state.

## Verify by hand

Toggle checkboxes in settings and the composer (NSFW, poll options): click and keyboard Space toggle, focus ring visible.
