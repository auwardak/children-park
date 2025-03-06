// app/api/settings/route.js
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (!key) {
    return NextResponse.json(
      { error: "Missing key parameter" },
      { status: 400 }
    );
  }

  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
  if (!row) {
    // Return a 204 No Content if not found (or you could return a default value)
    return new Response(null, { status: 204 });
  }

  return NextResponse.json({ value: row.value });
}

export async function POST(request) {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json(
      { error: "Missing key or value" },
      { status: 400 }
    );
  }

  // Use SQLite UPSERT syntax to insert or update the record.
  const stmt = db.prepare(`
    INSERT INTO settings (key, value) 
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  stmt.run(key, value.toString());

  return NextResponse.json({ key, value });
}
