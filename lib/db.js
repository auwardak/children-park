// lib/db.js
import Database from 'better-sqlite3';

const db = new Database('kids-park.db');
// Initialize all tables
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    source TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS daily_income (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    source TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS visitor_tracker (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    receipt_number TEXT NOT NULL UNIQUE,
    entry_time TIME NOT NULL,
    leaving_time TIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS visitor_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id INTEGER NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (visitor_id) REFERENCES visitor_tracker(id)
  );

  CREATE TABLE IF NOT EXISTS goods_bought (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS goods_sold (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL
  );
`);

export default db;