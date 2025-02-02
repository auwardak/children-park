import db from "@/lib/db";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || 1);
    const limit = parseInt(url.searchParams.get("limit") || 5);
    const date = url.searchParams.get("date");
    const type = url.searchParams.get("type");

    // Build the base query
    let query = `
      SELECT * 
      FROM transactions
    `;

    // Apply filtering
    const filters = [];
    if (date) filters.push(`date = '${date}'`);
    if (type) filters.push(`type = '${type}'`);

    if (filters.length > 0) {
      query += " WHERE " + filters.join(" AND ");
    }

    query += `
      ORDER BY date DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `;

    const transactions = db.prepare(query).all();

    return Response.json({ transactions });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
