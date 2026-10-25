# avatar

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/avatar.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Wraps `@base-ui/react/avatar`; image delay prop is now `delay` (was `delayMs`). Adds `AvatarBadge`/`AvatarGroup`/`AvatarGroupCount`. `mk-avatar.tsx` now imports `AvatarFallback` from `@/ui/avatar` instead of using `@radix-ui/react-avatar` directly, and the root uses `render={<Link/>}`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/avatar.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-avatar.tsx`
  - `src/components/mk-mention.tsx`
  - `src/components/note/mk-link-preview.tsx`
  - `src/components/note/mk-note-header.tsx`
  - `src/components/site-logo.tsx`
  - `src/routes/about/federation.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Fallback/image swap timing is driven by Base UI `delay` (default 0) rather than Radix `delayMs`. Avatars are local-cached/remote URLs; visual result is unchanged.

## Verify by hand

Check a note/user avatar: image appears, fallback blurhash shows while loading or on error, hover card opens on desktop and is disabled on touch, avatar links to the profile.
