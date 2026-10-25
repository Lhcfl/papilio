# dialog

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/dialog.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). `Overlay` -> `Backdrop`, `Content` -> `Popup`, portal/positioner model from Base UI. Close button uses lucide `XIcon`; `DialogClose` supports `render`. `providers/rightbar-or-popup.tsx` and `routes/login-redirect.tsx` no longer import `@radix-ui/react-dialog` directly.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/dialog.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-drive-file-select.tsx`
  - `src/components/mk-file-upload-menu.tsx`
  - `src/components/mk-post-form-dialog.tsx`
  - `src/components/note/mk-note-menu.tsx`
  - `src/modals/add-clip-modal.tsx`
  - `src/modals/edit-file-caption-modal.tsx`
  - `src/modals/flag-modal.tsx`
  - `src/modals/input-modal.tsx`
  - `src/providers/rightbar-or-popup.tsx`
  - `src/routes/login-redirect.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Enter/exit animations are transition-based (`data-starting-style`/`data-ending-style`); Radix auto-focus/dismiss callbacks are Base UI shaped (`initialFocus`/`finalFocus`). Dialogs in this app never used those callbacks.

## Verify by hand

Open post-form dialog, drive file select, caption editor, flag/input modals: Escape + backdrop close, close button works, focus returns to the opener, nested dialogs do not fight.
