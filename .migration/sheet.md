# sheet

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/sheet.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Rebuilt on Base UI Dialog with `Backdrop` + `Popup`; slide animations use `data-starting-style`/`data-ending-style` with explicit per-side translate. Close button uses lucide `XIcon`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/sheet.tsx` → no matches.
- No direct app-code consumers (only used by other `src/ui` wrappers).

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

`asChild` -> `render` throughout. Sheet is only used by `@/ui/sidebar`'s mobile branch.

## Verify by hand

Resize below 48rem: the mobile sidebar sheet slides in from the left, backdrop closes it, Escape works, focus is trapped.
