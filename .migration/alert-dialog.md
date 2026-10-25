# alert-dialog

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/alert-dialog.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). `Overlay` -> `Backdrop`, `Content` -> `Popup`, `Cancel` -> `Close`, `Action` dropped (plain `Button`); new `AlertDialogMedia` export added by the registry.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/alert-dialog.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/note/mk-note-poll.tsx`
  - `src/providers/confirm-dialog-provider.tsx`
  - `src/providers/error-dialog-provider.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Focus/dismiss callbacks are Base UI shaped (`initialFocus`/`finalFocus` instead of Radix auto-focus handlers). No call site used them, so nothing was rewritten.

## Verify by hand

Open the delete/logout confirmations: backdrop fades in, Escape and backdrop click cancel, focus returns to the trigger, confirm button runs the action.
