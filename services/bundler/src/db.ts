// @ts-nocheck
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const sponsorships = sqliteTable('sponsorships', {
  user: text('user').notNull(),
  date: text('date').notNull(),
  spent: integer('spent', { mode: 'bigint' }).notNull(),
}, (table) => ({
  pk: { columns: [table.user, table.date], isPrimary: true },
}));

export const whitelist = sqliteTable('whitelist', {
  dapp: text('dapp').primaryKey(),
});

let db: any;
if (!process.env.SKIP_DB) {
  const Database = (await import('better-sqlite3')).default;
  const { drizzle } = await import('drizzle-orm/better-sqlite3');
  const sqlite = new Database('db.sqlite');
  sqlite.pragma('journal_mode = WAL');
  db = drizzle(sqlite);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sponsorships (
      user TEXT NOT NULL,
      date TEXT NOT NULL,
      spent INTEGER NOT NULL,
      PRIMARY KEY (user, date)
    );
    CREATE TABLE IF NOT EXISTS whitelist (
      dapp TEXT PRIMARY KEY
    );
  `);
} else {
  db = {
    select: () => Promise.resolve([]),
    insert: () => ({ values: () => ({ onConflictDoUpdate: async () => {} }) }),
  } as any;
}

export { db };
