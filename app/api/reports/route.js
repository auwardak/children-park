// app/api/reports/route.js
import db from "@/lib/db";

export async function GET() {
  try {
    // Aggregate income per month from the transactions table
    const incomeData = db
      .prepare(
        `
      SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS income
      FROM transactions
      WHERE type = 'income'
      GROUP BY month
    `
      )
      .all();

    // Aggregate expenses per month from the transactions table
    const expenseData = db
      .prepare(
        `
      SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS expenses
      FROM transactions
      WHERE type = 'expense'
      GROUP BY month
    `
      )
      .all();

    // Merge income and expense data ensuring all months are included
    const dataMap = new Map();

    // Insert income data into the map
    for (const row of incomeData) {
      dataMap.set(row.month, {
        month: row.month,
        income: Number(row.income) || 0,
        expenses: 0,
      });
    }

    // Insert expense data, updating the map if the month already exists
    for (const row of expenseData) {
      if (dataMap.has(row.month)) {
        dataMap.get(row.month).expenses = Number(row.expenses) || 0;
      } else {
        dataMap.set(row.month, {
          month: row.month,
          income: 0,
          expenses: Number(row.expenses) || 0,
        });
      }
    }

    // Convert the map into an array and calculate profit
    const mergedData = Array.from(dataMap.values())
      .map((item) => ({
        ...item,
        profit: (item.income || 0) - (item.expenses || 0),
      }))
      // Optional: sort by month in ascending order
      .sort((a, b) => a.month.localeCompare(b.month));

    return Response.json(mergedData);
  } catch (error) {
    console.error("Error generating report:", error);
    return Response.json(
      { error: "Failed to generate reports" },
      { status: 500 }
    );
  }
}
