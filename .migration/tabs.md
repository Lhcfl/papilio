# tabs

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/tabs.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). `Trigger` -> `Tab`, `Content` -> `Panel`; adds `tabsListVariants`. Disabled styling uses `aria-disabled`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/tabs.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/layouts/sidebar-layout.tsx`
  - `src/routes/@{$acct}.tsx`
  - `src/routes/about/federation.tsx`
  - `src/routes/notes.$id/index.tsx`
  - `src/routes/search/user.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

FLAGGED: Base UI defaults to MANUAL activation, so arrow keys move focus without switching tabs (Radix defaulted to automatic). Keyboard-only tab switching now needs Enter/Space; no call site opted into `activateOnFocus`.

## Verify by hand

On profile/settings/notification tabs: click switches, arrow keys move focus, Enter/Space activates, content panel swaps and URL/state stays in sync.
