// lib/db.js
import Database from "better-sqlite3";

const db = new Database("kids-park1.db");

// Recreate or update tables. For development purposes, you might drop the table if it exists.
// (In production, you’d use proper migration tools.)
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    date DATE NOT NULL,
    source TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Updated visitor_tracker table: using "name" instead of "receipt_number" 
  -- and allowing leaving_time to be NULL until the visitor leaves.
  CREATE TABLE IF NOT EXISTS visitor_tracker (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    entry_time TIME NOT NULL,
    leaving_time TIME
  );

  -- Inventory table stores each product/item available for sale
  CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    name TEXT NOT NULL UNIQUE,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- (Optional) Inventory Transactions table to track each change to inventory
  CREATE TABLE IF NOT EXISTS inventory_transactions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    inventory_id TEXT NOT NULL,
    change INTEGER NOT NULL,
    transaction_type TEXT CHECK(transaction_type IN ('sale', 'restock')) NOT NULL,
    reference_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
  );
`);

export default db;
