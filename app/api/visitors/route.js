// app/api/visitors/route.js
import db from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    // Count total visitors for the given date
    const countResult = db
      .prepare("SELECT COUNT(*) as count FROM visitor_tracker WHERE date = ?")
      .get(date);
    const total = countResult.count;
    const totalPages = Math.ceil(total / pageSize);

    // Get visitor records for the date with pagination
    const visitors = db
      .prepare(
        "SELECT * FROM visitor_tracker WHERE date = ? ORDER BY entry_time DESC LIMIT ? OFFSET ?"
      )
      .all(date, pageSize, offset);

    return Response.json({ visitors, totalPages });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch visitors" },
      { status: 500 }
    );
  }
}
