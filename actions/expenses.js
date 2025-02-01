'use server';
import db from '@/lib/db';

export async function addExpense(formData) {
  const expense = {
    date: formData.get('date'),
    source: formData.get('source'),
    amount: formData.get('amount'),
  };

  db.prepare(
    'INSERT INTO daily_expenses (date, source, amount) VALUES (?, ?, ?)'
  ).run(expense.date, expense.source, expense.amount);
}