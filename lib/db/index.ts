import * as SQLite from "expo-sqlite";

import { migrations } from "./migrations";

const DATABASE_NAME = "repeatshot.db";

let database: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  const currentVersion = row?.user_version ?? 0;

  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.execAsync(migration.sql);
    await db.execAsync(`PRAGMA user_version = ${migration.version};`);
  }
}

export function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!initPromise) {
    initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await runMigrations(db);
      database = db;
      return db;
    })();
  }
  return initPromise;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!database) {
    throw new Error(
      "Database has not been initialized yet. Call initDatabase() first."
    );
  }
  return database;
}
