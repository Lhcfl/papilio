# scroll-area

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/scroll-area.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). `ScrollAreaScrollbar`/`ScrollAreaThumb` -> `Scrollbar`/`Thumb`; root wraps a `Viewport`. The Radix-only `orientation` prop on the root was dropped (`mk-code.tsx` updated); `ScrollBar` still accepts `orientation`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/scroll-area.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/app-right-card.tsx`
  - `src/components/menu-or-drawer.tsx`
  - `src/components/mk-avatar.tsx`
  - `src/components/mk-code.tsx`
  - `src/components/mk-custom-emoji-search-popup.tsx`
  - `src/components/mk-drive-file-select.tsx`
  - `src/components/mk-emoji-picker.tsx`
  - `src/layouts/sidebar-layout.tsx`
  - `src/modals/add-clip-modal.tsx`
  - `src/providers/rightbar-or-popup.tsx`
  - `src/routes/account-switch.tsx`
  - `src/routes/debug/ws.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Horizontal code blocks (`mk-code.tsx`) now rely on the viewport's native horizontal overflow without the dedicated vertical-scrollbar layout. Flagged: no horizontal scrollbar styling in code blocks.

## Verify by hand

Scroll note lists, drive and rightbar: vertical scrollbar appears on hover, thumb drags, no layout shift; code blocks still scroll sideways.
