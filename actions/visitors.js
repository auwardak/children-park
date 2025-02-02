// actions/visitors.js
"use server";
import db from "@/lib/db";

export async function addVisitor(formData) {
  const visitor = {
    date: formData.get("date"),
    name: formData.get("name"),
    entry_time: formData.get("entry_time"),
  };

  db.prepare(
    "INSERT INTO visitor_tracker (date, name, entry_time) VALUES (?, ?, ?)"
  ).run(visitor.date, visitor.name, visitor.entry_time);
}
