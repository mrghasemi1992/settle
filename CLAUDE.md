# CLAUDE.md

Guidance for Claude Code / CLI when working in this repository. This file is the
source of truth for conventions — when in doubt, follow this over inferring from
surrounding code.

## Project

A local-first personal finance and budgeting app. No backend. All data lives in
IndexedDB via Dexie. Built as a portfolio piece — code quality, accessibility,
and design polish matter as much as functionality.

## Stack

- Vite + React + TypeScript
- Dexie (IndexedDB) — primary data layer, `useLiveQuery` for reactive reads
- Zustand — ONLY for ephemeral UI state that isn't persisted data (e.g. active
  modal, selected date range in a picker). If it can be derived from Dexie via
  `useLiveQuery`, it does not belong in a store.
- Zod — schema validation for CSV import, form input, and Dexie table shapes
- Radix UI primitives (unstyled) — for Dialog, Select, Popover, Tooltip, Tabs,
  and the Jalali date picker. Never import Radix's or any library's prebuilt
  _styled_ components (e.g. shadcn). Compose Radix primitives and style them
  from scratch in CSS Modules.
- CSS Modules + CSS custom properties for design tokens. No Tailwind, no
  CSS-in-JS, no third-party styled component kits.
- Vitest + React Testing Library

## Folder structure & co-location

```
src/
  components/
    button/
      index.tsx
      styles.module.css
      spec.test.tsx
  features/
    transactions/
      components/
      hooks/
      db/          <- Dexie table schema + queries for this feature
      transactions.test.ts
  db/
    schema.ts      <- Dexie database + version definitions
  i18n/
  stores/          <- Zustand stores, one file per store, only if justified
  styles/
    tokens.css     <- design tokens (colors, spacing, type scale, radii)
    theme-light.css / theme-dark.css
```

Component folders use lowercase names with generic, predictable file names
(`index.tsx`, `styles.module.css`, `spec.test.tsx`) rather than repeating the
component name in each filename. Co-locate tests, styles, and types next to
the component/feature that owns them. Shared/cross-feature code only lives in
top-level `components/`, `db/`, `styles/`.

## Design tokens & theming

- All colors, spacing, radii, shadows, font sizes are CSS custom properties in
  `styles/tokens.css`, overridden per-theme in `theme-light.css` / `theme-dark.css`.
- System theme preference respected via `prefers-color-scheme`, with a manual
  override stored in `localStorage` (light/dark/system three-way toggle).
- Never hardcode a color or spacing value in a component's `.module.css` —
  always reference a token.

## i18n, RTL, calendars, currency

- Supported locales: `en` (LTR, Gregorian, USD/EUR), `fa` (RTL, Jalali, IRR).
- Use CSS logical properties (`margin-inline-start`, not `margin-left`, etc.)
  everywhere — never physical left/right properties — so RTL is automatic.
- `dir="rtl"`/`dir="ltr"` set at the document root based on active locale.
- Date handling: all dates stored in Dexie as ISO/Gregorian. Convert to Jalali
  only at the display layer via the Jalali plugin. Never store Jalali dates.
- Currency: store amounts as integer minor units (cents/rials) in Dexie. Format
  for display via `Intl.NumberFormat` per active locale/currency, never by
  hand-building strings.

## State management rules

1. Default to `useLiveQuery` reading directly from Dexie.
2. Reach for Zustand only for state with no natural persisted home (UI-only,
   session-only). Justify each store's existence in a comment at its top.

## Testing

- Every component gets a co-located `.test.tsx` covering rendered states and
  key interactions (not implementation details).
- Every Dexie query/mutation module gets a co-located `.test.ts`.
- Run the full suite before every commit.

## Git & commits

- One feature phase per branch (e.g. `feature/transactions`, `feature/dashboard`).
- Conventional commit style: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`.
- Merge only after tests pass and the phase's design spec (see below) is fully
  implemented.

## Design spec workflow (Claude Design ↔ Claude Code sync)

Each feature phase is designed in Claude Design first. Before implementation,
distill that session into a spec file at `docs/design-specs/<feature>.md`
covering: components used, all states (empty/loading/error/RTL), breakpoints,
and any new tokens introduced. Claude Code reads that spec alongside this file
before implementing. If implementation reveals a gap in the spec, update the
spec file in the same commit — it should never drift out of sync with the code.

## Phase order

1. Foundations (tokens, theming, i18n/RTL scaffold, base primitives)
2. App shell & navigation (locale + theme switcher wired in)
3. Transactions (CRUD, list/table)
4. Dashboard
5. Reports
6. Budgeting
7. Import/Export (incl. CSV)
8. Backup & sync (Google Drive, iCloud export)
