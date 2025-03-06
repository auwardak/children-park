// lib/db.js
import Database from "better-sqlite3";

const db = new Database("kids-park1.db");

// Create or update tables.
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    date DATE NOT NULL,
    source TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS visitor_tracker (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    entry_time TIME NOT NULL,
    leaving_time TIME
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export default db;
