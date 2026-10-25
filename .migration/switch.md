# switch

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/switch.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). 1:1 wrapper on `@base-ui/react/switch`; `checked`/`onCheckedChange` unchanged.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/switch.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/menu-or-drawer.tsx`
  - `src/components/post-form/mk-post-form-poll.tsx`
  - `src/components/settings/profile/profile-base-info-edit.tsx`
  - `src/components/settings/switch.tsx`
  - `src/modals/add-clip-modal.tsx`
  - `src/routes/debug/ws.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

None observed.

## Verify by hand

Toggle switches in settings and composer: click and Space toggle, thumb slides, disabled state is inert.
