// app/api/dashboard/route.js
import db from "@/lib/db";

export async function GET(request) {
  // Get today's date in YYYY-MM-DD format
  const todayVisitor = new Date().toISOString().split("T")[0]; // Ensure correct format
  const todayTransaction = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format in local timezone
  try {
    // Total visitors for today
    const totalVisitorsResult = db
      .prepare(
        `SELECT COUNT(*) as count 
         FROM visitor_tracker 
         WHERE date = ?`
      )
      .get(todayVisitor);

    const visitors = totalVisitorsResult.count || 0;

    // Active visitors: those with leaving_time still null or empty
    const activeVisitorsResult = db
      .prepare(
        `SELECT COUNT(*) as count 
         FROM visitor_tracker 
         WHERE date = ? 
         AND (leaving_time IS NULL OR leaving_time = '')`
      )
      .get(todayVisitor);
    const activeVisitors = activeVisitorsResult.count || 0;

    // Total income for today
    const incomeResult = db
      .prepare(
        `SELECT COALESCE(SUM(amount), 0) as total 
         FROM transactions 
         WHERE type = 'income' 
         AND date = ?`
      )
      .get(todayTransaction);
    const income = Number(incomeResult.total);

    // Total expenses for today
    const expenseResult = db
      .prepare(
        `SELECT COALESCE(SUM(amount), 0) as total 
         FROM transactions 
         WHERE type = 'expense' 
         AND date = ?`
      )
      .get(todayTransaction);
    const expenses = Number(expenseResult.total);

    return Response.json({
      visitors,
      activeVisitors,
      income,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
