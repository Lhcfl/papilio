# select

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/select.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). `Viewport` -> `List`, `ScrollUp/DownButton` -> `ScrollUp/DownArrow`, `GroupLabel`/`ItemIndicator` renames; icons are lucide. `position` is replaced by `alignItemWithTrigger` (wrapper default: true, i.e. selected item aligned with the trigger). `onValueChange` value is `string | null`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/select.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/post-form/mk-post-form-poll.tsx`
  - `src/components/settings/app-font-select.tsx`
  - `src/components/settings/app-language-select.tsx`
  - `src/components/settings/enum.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Call sites widened: `app-font-select`, `app-language-select` and `mk-post-form-poll` now guard against `null`. The popup is item-aligned by default, so select popups sit over the trigger instead of below it — accepted as part of the visual redesign.

## Verify by hand

Change font/language in settings and poll expiry options: popup opens aligned, keyboard typeahead + arrows select, chosen value renders in the trigger, Escape reverts.
