# progress

2026-10-25 — golden pair via shadcn registry (`radix-vega` → `base-vega`), whole-project mode.

## Changed

- `src/ui/progress.tsx` — replaced the Radix wrapper with the shadcn `base-vega` variant (fetched from the registry, imports rewired to `@/lib/utils` and `@/ui/*`, `IconPlaceholder` inlined as `lucide-react` icons). Base UI `Progress` computes the fill itself; the manual `translateX` style is gone. New `ProgressTrack`/`ProgressIndicator`/`ProgressLabel`/`ProgressValue` exports.
- Leftover scan: `grep -n "radix-ui\|@radix-ui" src/ui/progress.tsx` → no matches.
- Consumers repointed from `@/components/ui` to `@/ui` and adjusted for Base UI props (see below):
  - `src/components/mk-clock.tsx`
  - `src/components/mk-post-form.tsx`
  - `src/components/uploading-toast.tsx`
  - `src/routes/my/relations/-common.tsx`

## Left alone

- All wrappers were confirmed to be stock registry output (only import paths, SPDX/formatting and the `src/ui` move differed), so no three-way merge was needed.
- Unrelated libraries remain untouched by design: `drawer.tsx` (vaul), `sonner.tsx` (sonner), `input-otp`/`command`/`chart`/`calendar` are not present in this project.
- Other `src/ui` wrappers are covered by their own `.migration/<component>.md` file.

## Behavior changes

Fill animation is driven by the primitive's CSS variables instead of an inline transform.

## Verify by hand

Check upload progress: bar fills proportionally, indeterminate/zero states look sane.
