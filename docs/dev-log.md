# Dev Log

---

## 2026-07-20 — Milestone 1, Issue 1: Initialize SQLite when the app launches

### Summary

Added infrastructure to open a local SQLite database automatically on app
launch and create the `projects` table via a versioned migration. No UI
or feature code was added — this is the storage layer only.

### Files changed

- **`lib/db/migrations.ts`** (new) — Ordered list of schema migrations.
  Currently a single migration (version 1) that creates the `projects`
  table per `docs/database.md` (`id`, `name`, `cover_photo_uri`,
  `created_at`, `updated_at`, `archived`). Future schema changes are
  added as new entries here rather than editing existing ones, per the
  "never modify production tables directly" rule in `docs/decisions.md`.
- **`lib/db/index.ts`** (new) — `initDatabase()` opens `repeatshot.db`
  via `expo-sqlite` and applies any pending migrations, tracked with
  SQLite's built-in `PRAGMA user_version` (no separate version table
  needed). The result is cached in a module-level promise so repeated
  calls resolve to the same initialization instead of reopening the
  database or re-running migrations. `getDatabase()` returns the open
  handle for later feature code to use once initialized.
- **`app/_layout.tsx`** (modified) — Calls `initDatabase()` once from a
  `useEffect` with an empty dependency array when the root layout
  mounts (i.e. on app launch). The effect only performs the side
  effect; the rendered `<Stack />` output is unchanged, so there is no
  UI change.
- **`package.json`** / **`package-lock.json`** (modified) — Added the
  `expo-sqlite` dependency. Also added an `overrides` entry pinning
  `react-dom` to `19.2.3` (see Notes below).
- **`lib/.gitkeep`** (removed) — No longer needed now that `lib/db/`
  has real content.

### Notes / blocker encountered

Installing `expo-sqlite` initially failed with an npm `ERESOLVE` peer
dependency conflict, unrelated to `expo-sqlite` itself: `expo-router`
bundles `@expo/ui`'s web devtools, which pull in `radix-ui` components
requiring `react-dom@19.2.7`, while the project pins `react@19.2.3`.
Confirmed this conflict pre-existed in the committed `package.json` (it
reproduces on a plain reinstall without the `expo-sqlite` change) and
was not introduced by this issue. Fixed by adding an `overrides` entry
pinning `react-dom` to `19.2.3`, which matches the project's `react`
version and satisfies `react-dom@19.2.3`'s own peer requirement
(`react@^19.2.3`). This is a build-tooling fix, not feature code.

### Verification

- `npx tsc --noEmit` — passes, no type errors.
- `npx expo-doctor` — 20/20 checks passed.
- `npx expo export --platform ios` — Metro bundled successfully
  (1120 modules, up from 1087 before adding `expo-sqlite`).
- `npx expo start` — dev server boots cleanly with no errors, then was
  stopped.
- **Not verified**: actual on-device execution of `initDatabase()`
  (i.e. that the file is created and the `projects` table exists at
  runtime). No iOS Simulator or physical device is available in this
  environment (only Xcode Command Line Tools are installed, not the
  full Xcode app). The bundling/typecheck steps above confirm the code
  is correct and ships, but the runtime behavior should be confirmed
  on a physical device per the project's Definition of Done.
