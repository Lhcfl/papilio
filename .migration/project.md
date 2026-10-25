# project

2026-10-25 — whole-project Radix UI → Base UI migration plus UI-directory restructure.

## What changed globally

- **Structure**: `src/components/ui/**` moved to `src/ui/**` (git mv, history preserved).
  - `components.json` `aliases.ui` is now `@/ui`.
  - `src/ui/biome.json` and `src/ui/LICENCE.md` moved along with the wrappers.
  - `.oxlintrc.json` ignores `src/ui/*.tsx`; `REUSE.toml` licenses `src/ui/**` as MIT; `dev-scripts/add-licence-header.js` excludes `src/ui/**`.
  - All app imports were rewritten `@/components/ui/X` → `@/ui/X` (109 files before the sweep, 94 files import the migrated wrappers).
- **Dependencies**:
  - Added `@base-ui/react@1.9.0`.
  - Removed `radix-ui`, all 15 `@radix-ui/react-*` packages and updated `pnpm-lock.yaml`.
  - `components.json` style flipped `radix-vega` → `base-vega`.
- **Registry strategy**: every one of the 23 Radix wrappers was diffed against its stock `radix-vega` file. The user confirmed there were no customizations (only formatting/import paths), so each wrapper was replaced with the stock `base-vega` variant (fetched from `https://ui.shadcn.com/r/styles/base-vega/<component>.json`) and rewired:
  - `cn` import → `@/lib/utils`
  - `@/registry/base-vega/ui/*` → `@/ui/*`
  - `@/registry/base-vega/hooks/use-mobile` → `@/hooks/mobile`
  - registry `IconPlaceholder` → concrete `lucide-react` icons (ChevronDown/Up/Right, Check, X, MoreHorizontal, PanelLeft)
  - `cn-rtl-flip` → `rtl:rotate-180`

## Migrated wrappers (23)

accordion, alert-dialog, avatar, badge, breadcrumb, button, button-group, checkbox, dialog, dropdown-menu, hover-card, item, label, popover, progress, scroll-area, select, separator, sheet, sidebar, switch, tabs, tooltip.

Each has its own report in `.migration/<component>.md`.

## App-code sweep (outside `src/ui`)

- `asChild` → `render` at 43 call sites in 25 files (Button, Item, Badge, BreadcrumbLink, DialogClose, DialogTrigger, TooltipTrigger, HoverCardTrigger/Content, DropdownMenuTrigger, PopoverTrigger, SidebarMenuButton).
  - `{children}` triggers are passed with a narrow cast: `render={children as React.ReactElement<Record<string, unknown>>}` (DialogTrigger in input/caption/drive-select/post-form dialogs, PopoverTrigger in the emoji picker).
- Direct Radix imports removed:
  - `src/components/mk-avatar.tsx` → `AvatarFallback` from `@/ui/avatar`.
  - `src/components/post-form/mk-post-form-preview.tsx` → `@/ui/accordion`, `type="single" collapsible` dropped.
  - `src/providers/rightbar-or-popup.tsx` → `DialogTitle` from `@/ui/dialog`.
  - `src/routes/login-redirect.tsx` → `DialogClose` from `@/ui/dialog`.
- Accordion: `type="multiple"` → `multiple` (emoji picker ×3, settings page, profile advanced settings).
- Select: `onValueChange` now receives `string | null`; guarded in `app-font-select`, `app-language-select`, `mk-post-form-poll`.
- ScrollArea: Radix-only `orientation` prop removed in `mk-code.tsx`.
- `AGENTS.md` updated (tech stack, directory layout, `src/ui` conventions, `render` instead of `asChild`, generated-files table).

## Flags (deliberately not patched)

- Tooltip delay default is now ~0ms instead of Radix's 700ms.
- Tabs use manual keyboard activation (arrow keys move focus, Enter/Space activates).
- Select popups are item-aligned by default (`alignItemWithTrigger`), so they overlap the trigger.
- `Menu.CheckboxItem`/`RadioItem` default to `closeOnClick=false` (unused in this app).
- Horizontal code blocks rely on native viewport overflow; the dedicated horizontal scrollbar styling is gone.
- Dialogs/alert-dialogs use Base UI focus/dismiss callbacks (`initialFocus`/`finalFocus`); no call site used the Radix ones.

## Not migrated (not Radix)

- `src/ui/drawer.tsx` — vaul (its Radix dialog dependency is transitive and untouched).
- `src/ui/sonner.tsx` — sonner.
- All non-migrated wrappers (alert, card, empty, field, input, input-group, skeleton, spinner, table, textarea) moved to `src/ui` unchanged.

## Verification

- Baseline `pnpm typecheck` before the work: clean.
- After the migration: `pnpm typecheck` clean, `pnpm lint` clean for `src/`, `pnpm build` succeeds (`✓ built in 8.70s`), `pnpm licence:check` passes.
- Pre-existing, unrelated: `pnpm lint` reports errors inside `.agents/skills/**` (vendored skill assets); those files are untouched by this migration.
- Dev-server smoke test: `/login` and `/login-redirect` render with no console errors.
- Remaining wrappers on Radix: **0**.
