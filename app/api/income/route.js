import db from '@/lib/db';

export async function GET() {
  try {
    const income = db.prepare('SELECT * FROM daily_income ORDER BY date DESC').all();
    return Response.json(income);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch income records' },
      { status: 500 }
    );
  }
}