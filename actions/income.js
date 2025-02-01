'use server';
import db from '@/lib/db';

export async function addIncome(formData) {
  try {
    const incomeData = {
      date: formData.get('date'),
      source: formData.get('source'),
      amount: formData.get('amount')
    };

    db.prepare(
      'INSERT INTO daily_income (date, source, amount) VALUES (?, ?, ?)'
    ).run(incomeData.date, incomeData.source, incomeData.amount);

    return { success: true };
  } catch (error) {
    console.error('Error adding income:', error);
    return { error: 'Failed to add income record' };
  }
}