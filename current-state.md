# Current State

Last updated: 2026-07-20 (Milestone 1, Issue 1 — Initialize SQLite on app launch)

This file is a living snapshot of what's actually implemented, what's
known to be fragile, and what to check first when something breaks.
It gets overwritten/extended as issues land — it is not a changelog.
For a chronological history of what shipped per issue, see
`docs/dev-log.md`.

---

## Database layer (`lib/db/`)

**What exists:** `initDatabase()` in `lib/db/index.ts` opens
`repeatshot.db` via `expo-sqlite` and applies pending migrations from
`lib/db/migrations.ts`, tracked with SQLite's `PRAGMA user_version`
(no separate version table). It's called once from a `useEffect` in
`app/_layout.tsx` on app launch. `getDatabase()` returns the open
handle — but only after `initDatabase()` has resolved.

Currently one migration exists: version 1 creates the `projects`
table (`id`, `name`, `cover_photo_uri`, `created_at`, `updated_at`,
`archived`) per `docs/database.md`. No `photos` or `settings` tables
yet — those are separate, not-yet-started issues.

**Known limitations / fragile points:**

- **No ready-gate for consumers.** `getDatabase()` throws if called
  before `initDatabase()` resolves. Nothing currently waits for that
  promise except the effect that starts it. This is invisible today
  because no screen queries the database yet. It will surface as soon
  as a feature screen calls `getDatabase()` on mount and loses the
  race with the root layout's effect. Needs a `DatabaseProvider` /
  ready-state context before any feature code reads/writes data.
- **Migrations are not transactional.** Each migration runs as one
  `execAsync` call, then a separate call bumps `PRAGMA user_version`.
  Safe today because migration 1 is a single `CREATE TABLE IF NOT
  EXISTS`. Not safe once a migration has multiple statements (e.g.
  alter + backfill) — a partial failure would change the schema
  without bumping the version, so the next launch would try to
  reapply a migration against an already-half-migrated table. Wrap
  multi-statement migrations in an explicit transaction before
  writing migration 2.
- **No test coverage on the migration runner.** Nothing simulates
  "already at version N, add version N+1, confirm it applies exactly
  once." SQLite migrations are unforgiving on real user devices — no
  do-overs once someone has data. Add a test harness before the
  schema grows further.
- **Init failures are silent.** If `initDatabase()` rejects, it's a
  `console.error` in `app/_layout.tsx` and nothing else. The app
  keeps running as if storage works. Fine while nothing depends on
  data; not fine once screens do.
- **Runtime behavior is unverified.** No iOS Simulator is available
  in this dev environment (only Xcode Command Line Tools, not the
  full Xcode app). Verified: `tsc --noEmit` clean, `expo-doctor`
  20/20, `expo export --platform ios` bundles (1120 modules). NOT
  verified: that `repeatshot.db` and the `projects` table are
  actually created at runtime. Confirm on a physical device before
  trusting this.

---

## Dependency tooling note

`package.json` has an `overrides` entry pinning `react-dom` to
`19.2.3`. This is not a feature dependency — `react-dom` isn't used
by the app itself. It exists because `expo-router` bundles `@expo/ui`
(web devtools), which pulls in `radix-ui` components that want a
newer `react-dom` than the project's pinned `react@19.2.3` satisfies,
which made `npm install` fail outright with an ERESOLVE error.

**If `npm install` starts failing with an ERESOLVE conflict
mentioning `radix-ui`, `@expo/ui`, or `react-dom`:** this override is
the reason it currently doesn't. It's tied to `expo-router@~57.0.7`'s
internal dependency graph, so a future `expo` SDK upgrade can shift
the required `react-dom` version and either make this override
unnecessary or require bumping it. Re-check this override any time
`expo`/`expo-router` is upgraded — don't just re-apply the same fix
blindly.

---

## Debugging checklist

- **App fails to launch / crashes on start:** check for a
  `"Failed to initialize database"` log from `app/_layout.tsx` — that
  means `initDatabase()` rejected. Check the underlying error from
  `expo-sqlite` (disk space, file permissions, corrupt db file).
- **A table/column seems missing after a code change:** check
  `PRAGMA user_version` on-device against the highest `version` in
  `lib/db/migrations.ts`. If they already match, the migration won't
  re-run — bump the version and add a new migration entry instead of
  editing an existing one (existing migrations must never change once
  shipped, per `docs/decisions.md`).
- **`npm install` fails with ERESOLVE:** see "Dependency tooling
  note" above before changing dependency versions.
- **Something reads the database and gets a "Database has not been
  initialized yet" error:** the caller ran before `initDatabase()`
  resolved. This is the known gap described above — the fix is a
  ready-gate, not a workaround at the call site.

---

## Refactor backlog (not yet scheduled)

1. Add a `DatabaseProvider` / ready-state context so feature screens
   can gate on database readiness instead of each caller discovering
   `getDatabase()` throws independently.
2. Wrap multi-statement migrations in explicit transactions — do this
   *before* writing migration 2, not after something breaks.
3. Add a test harness for the migration runner (in-memory or temp-file
   SQLite) covering: fresh install, incremental upgrade, no-op on
   already-current version.
4. Revisit the `react-dom` override in `package.json` at the next
   Expo SDK upgrade — confirm it's still needed.
5. Verify `initDatabase()` on a physical device or simulator; this
   has only been verified via typecheck + bundle export so far.
