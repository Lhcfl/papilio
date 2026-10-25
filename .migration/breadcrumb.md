# breadcrumb

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/breadcrumb.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). `BreadcrumbLink` uses `useRender` instead of Radix `Slot`; the separator chevron is a lucide `ChevronRightIcon` with `rtl:rotate-180`. Modal ellipsis uses `MoreHorizontalIcon`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/breadcrumb.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/file/mk-drive-breadcrumb.tsx`
  - `src/components/mk-drive.tsx`
  - `src/routes/settings/$page.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

`asChild` removed; conditional button/link breadcrumbs were split into explicit branches in `file/mk-drive-breadcrumb.tsx` and `routes/settings/$page.tsx`.

## Verify by hand

Drive breadcrumb: click each segment, check the custom `onSelect` button variant closes/opens the right folder, separators align.
