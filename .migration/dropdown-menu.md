# dropdown-menu

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/dropdown-menu.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Radix `DropdownMenu` -> Base UI `Menu`. `Label` -> `GroupLabel`, `ItemIndicator` -> `CheckboxItemIndicator`/`RadioItemIndicator`, `Sub`/`SubTrigger` -> `SubmenuRoot`/`SubmenuTrigger`, `Content` -> `Portal > Positioner > Popup`, `SubContent` rebuilt from the Content component. Icons are lucide.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/dropdown-menu.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/menu-or-drawer.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

`Menu.Item` still closes on click (default `closeOnClick`), but `CheckboxItem`/`RadioItem` default to `closeOnClick=false`. This app does not use checkbox/radio menu items, so no visible change. Sub-trigger open state is exposed as `data-popup-open`.

## Verify by hand

Open the note menu, account menu and menu-or-drawer: hover submenus, click an item and confirm it closes, keyboard arrows/typeahead work, destructive items are red.
