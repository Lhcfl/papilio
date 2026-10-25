# tooltip

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/tooltip.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Portal/Positioner/Popup model. `TooltipProvider` takes `delay` (was `delayDuration`); the wrapper default is `0`. Arrow is a real `Tooltip.Arrow` with per-side classes. `disableHoverableContent` has no equivalent.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/tooltip.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-follow-request.tsx`
  - `src/components/mk-image.tsx`
  - `src/components/settings/header.tsx`
  - `src/routes/notes.$id/index.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

FLAGGED: tooltips now appear with ~0ms delay instead of Radix's 700ms, and hoverable-content disabling is gone. This is intentional for the redesign but changes the feel.

## Verify by hand

Hover sidebar icons and post-form buttons: tooltip appears immediately, follows the correct side, disappears on leave, does not block the click.
