'use server';
import db from '@/lib/db';

export async function addVisitor(formData) {
  const visitor = {
    date: formData.get('date'),
    receipt_number: formData.get('receipt_number'),
    entry_time: formData.get('entry_time'),
    leaving_time: formData.get('leaving_time'),
  };

  const { lastInsertRowid } = db
    .prepare(
      'INSERT INTO visitor_tracker (date, receipt_number, entry_time, leaving_time) VALUES (?, ?, ?, ?)'
    )
    .run(
      visitor.date,
      visitor.receipt_number,
      visitor.entry_time,
      visitor.leaving_time
    );

  // Add items bought
  const items = JSON.parse(formData.get('items'));
  items.forEach((item) => {
    db.prepare(
      'INSERT INTO visitor_items (visitor_id, item, quantity, amount) VALUES (?, ?, ?, ?)'
    ).run(lastInsertRowid, item.item, item.quantity, item.amount);
  });
}