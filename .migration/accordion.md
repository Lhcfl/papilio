# accordion

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/accordion.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Root/Item/Header/Trigger unchanged; `Content` -> `Panel`, height var `--accordion-content-height` -> `--accordion-panel-height`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/accordion.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-emoji-picker.tsx`
  - `src/components/post-form/mk-post-form-preview.tsx`
  - `src/components/settings/profile/profile-base-info-edit.tsx`
  - `src/routes/settings/$page.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Radix `type="single"|"multiple"` + `collapsible` are gone. Call sites now use `multiple` (or omit it); Base UI's default is multi-open (`openMultiple`). The post-form CW preview used `type="single" collapsible` and now renders a plain single-item accordion, which is functionally equivalent.

## Verify by hand

Expand/collapse every accordion in settings, emoji picker categories and the post-form CW preview; check open/close height transition, keyboard Enter/Space on the trigger, and that the chevron swaps direction.
