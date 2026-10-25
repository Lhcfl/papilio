# hover-card

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/hover-card.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Radix `HoverCard` -> Base UI `PreviewCard`; public wrapper names stay `HoverCard*`. `HoverCardTrigger` now takes `render`. Root is inside a Portal/Positioner/Popup stack.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/hover-card.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-avatar.tsx`
  - `src/components/note/mk-visibility-icon.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Open/close delays moved to the trigger (`delay`/`closeDelay`); no call site passes them. `asChild` on the trigger became `render` in `mk-avatar.tsx`.

## Verify by hand

Hover an avatar: the card appears after the default delay, follows the pointer away, and the profile skeleton/content scrolls inside it.
