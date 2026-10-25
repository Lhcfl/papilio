# sidebar

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/sidebar.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Registry sidebar rebuilt on Base UI `Sheet`, `Tooltip`, `Input`, `Skeleton`, `Separator`, `Button`. `useIsMobile` now comes from `@/hooks/mobile`. All 16 internal `asChild` usages became `render`; consumers (`app-sidebar-*`, `app-nav-bar`) migrated the same way.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/sidebar.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/app-nav-bar.tsx`
  - `src/components/app-sidebar.tsx`
  - `src/components/sidebar/app-sidebar-footer.tsx`
  - `src/components/sidebar/app-sidebar-header.tsx`
  - `src/components/sidebar/app-sidebar-main.tsx`
  - `src/components/sidebar/app-sidebar-menu-button.tsx`
  - `src/components/sidebar/logout-sidebar-footer.tsx`
  - `src/layouts/sidebar-layout.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Expanded/collapsed state is still exposed as `data-state` on the sidebar wrapper, so existing `group-data-[state="collapsed"]` classes in app code keep working; the provider also emits `data-collapsible`. SidebarProvider still uses a cookie for the default open state.

## Verify by hand

Toggle the sidebar (button + Ctrl/Cmd+B), check collapsed icon mode, mobile sheet, tooltips in collapsed mode, and that the footer account menu still opens.
