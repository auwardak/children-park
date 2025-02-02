// app/api/visitors/markLeft/route.js
import db from "@/lib/db";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const leavingTime = formData.get("leaving_time");
    // Update the visitor record with the provided leaving time
    db.prepare("UPDATE visitor_tracker SET leaving_time = ? WHERE id = ?").run(
      leavingTime,
      id
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to mark visitor as left" },
      { status: 500 }
    );
  }
}
