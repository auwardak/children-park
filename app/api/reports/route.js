// app/api/reports/route.js
import db from '@/lib/db';

export async function GET() {
  try {
    const incomeData = db.prepare(`
      SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS income 
      FROM daily_income 
      GROUP BY strftime('%Y-%m', date)
    `).all();

    const expenseData = db.prepare(`
      SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS expenses 
      FROM daily_expenses 
      GROUP BY strftime('%Y-%m', date)
    `).all();

    // Merge data
    const mergedData = incomeData.map(income => {
      const expense = expenseData.find(e => e.month === income.month);
      return {
        month: income.month,
        income: income.income || 0,
        expenses: expense?.expenses || 0,
        profit: (income.income || 0) - (expense?.expenses || 0)
      };
    });

    return Response.json(mergedData);
  } catch (error) {
    return Response.json(
      { error: 'Failed to generate reports' },
      { status: 500 }
    );
  }
}