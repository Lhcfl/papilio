# button

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/button.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Migrated to the real `@base-ui/react/button` primitive (not a useRender shim). `asChild` is gone in favour of `render`. Variants rewritten by the registry (destructive is now a tinted destructive, outline/secondary use `aria-expanded` styling, new `xs`/`icon-xs` sizes).
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/button.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/app-nav-bar.tsx`
  - `src/components/infinite-loaders/announcements-list.tsx`
  - `src/components/infinite-loaders/mk-notifications.tsx`
  - `src/components/infinite-loaders/mk-timeline.tsx`
  - `src/components/menu-or-drawer.tsx`
  - `src/components/mk-drive-file-select.tsx`
  - `src/components/mk-error.tsx`
  - `src/components/mk-file-upload-menu.tsx`
  - `src/components/mk-follow-request.tsx`
  - `src/components/mk-image.tsx`
  - `src/components/mk-note-replies.tsx`
  - `src/components/mk-note.tsx`
  - `src/components/mk-notification.tsx`
  - `src/components/mk-post-form-dialog.tsx`
  - `src/components/mk-post-form.tsx`
  - `src/components/mk-user-card.tsx`
  - `src/components/note/mk-link-preview.tsx`
  - `src/components/note/mk-muteable-note.tsx`
  - `src/components/note/mk-note-actions.tsx`
  - `src/components/note/mk-note-body.tsx`
  - `src/components/note/mk-note-menu.tsx`
  - `src/components/note/mk-note-renote-tip.tsx`
  - `src/components/post-form/mk-post-form-files.tsx`
  - `src/components/post-form/mk-visibility-picker.tsx`
  - `src/components/settings/note-default-reaction.tsx`
  - `src/components/settings/profile/avatar-and-banner-edit.tsx`
  - `src/components/settings/profile/profile-base-info-edit.tsx`
  - `src/components/sidebar/app-sidebar-header.tsx`
  - `src/components/user/mk-user-card-button.tsx`
  - `src/loaders/with-login.tsx`
  - `src/modals/add-clip-modal.tsx`
  - `src/modals/edit-file-caption-modal.tsx`
  - `src/modals/flag-modal.tsx`
  - `src/modals/input-modal.tsx`
  - `src/providers/confirm-dialog-provider.tsx`
  - `src/providers/rightbar-or-popup.tsx`
  - `src/routes/$missing.tsx`
  - `src/routes/@{$acct}.tsx`
  - `src/routes/about/tools.tsx`
  - `src/routes/account-switch.tsx`
  - `src/routes/login-redirect.tsx`
  - `src/routes/login.tsx`
  - `src/routes/my/drive/file.$file/index.tsx`
  - `src/routes/my/lists/index.tsx`
  - `src/routes/my/relations/-common.tsx`
  - `src/routes/notes.$id/index.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Base UI button adds `active:translate-y-px` press feedback and `aria-expanded` styling for menu triggers. Disabled handling is `disabled`/`aria-disabled` from Base UI.

## Verify by hand

Click through primary/outline/ghost/destructive buttons in dialogs, sidebars and menus; confirm IconButton sizes, disabled state and that link-rendered buttons (`render={<Link/>}`) still navigate.
