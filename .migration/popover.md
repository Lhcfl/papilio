# popover

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/popover.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Portal/Positioner/Popup model; new `PopoverHeader`/`PopoverTitle`/`PopoverDescription` parts. `PopoverAnchor` was dropped (no Base UI equivalent, and this project had no usages).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/popover.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-emoji-picker-popup.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Dismissal is handled by Base UI (`onOpenChange` keeps the same single-boolean shape at the call site). `mk-emoji-picker-popup.tsx` passes its trigger element through `render`.

## Verify by hand

Open the emoji picker on desktop: it positions near the trigger, closes on outside click/Escape, choosing an emoji works.
