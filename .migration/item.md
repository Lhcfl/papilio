# item

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/item.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Registry wrapper rebuilt with `useRender`; `asChild` -> `render`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/item.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/file/mk-drive-folder.tsx`
  - `src/components/infinite-loaders/announcements-list.tsx`
  - `src/components/infinite-loaders/clips-list.tsx`
  - `src/components/infinite-loaders/note-reactions-list.tsx`
  - `src/components/infinite-loaders/note-renotes-list.tsx`
  - `src/components/mk-alert.tsx`
  - `src/components/mk-follow-request.tsx`
  - `src/components/mk-notification.tsx`
  - `src/components/note/mk-link-preview.tsx`
  - `src/components/note/mk-note-file.tsx`
  - `src/components/note/mk-note-translation.tsx`
  - `src/components/notification/item-media.tsx`
  - `src/components/post-form/mk-post-form-files.tsx`
  - `src/modals/add-clip-modal.tsx`
  - `src/routes/about/federation.tsx`
  - `src/routes/about/tools.tsx`
  - `src/routes/account-switch.tsx`
  - `src/routes/clips.$id/index.tsx`
  - `src/routes/my/clips.tsx`
  - `src/routes/my/drive/file.$file/index.tsx`
  - `src/routes/my/lists/index.tsx`
  - `src/routes/settings/$page.tsx`
  - `src/routes/settings/index.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

`render` merges Item classes with the rendered element (Link/button). No behavioural change.

## Verify by hand

Items in settings list, account switch, drive folder and clips: whole row clickable, hover background, icons aligned.
