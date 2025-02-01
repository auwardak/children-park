import db from '@/lib/db';
import VisitorForm from '@/components/VisitorForm';

export default function VisitorsPage() {
  const visitors = db.prepare(`
    SELECT vt.*, 
    (SELECT SUM(amount) FROM visitor_items WHERE visitor_id = vt.id) AS total_spent
    FROM visitor_tracker vt
  `).all();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Visitor Tracker</h1>
      <VisitorForm />
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Receipt</th>
              <th className="px-4 py-2">Entry Time</th>
              <th className="px-4 py-2">Exit Time</th>
              <th className="px-4 py-2">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.id} className="border-t">
                <td className="px-4 py-2">{visitor.date}</td>
                <td className="px-4 py-2">{visitor.receipt_number}</td>
                <td className="px-4 py-2">{visitor.entry_time}</td>
                <td className="px-4 py-2">{visitor.leaving_time}</td>
                <td className="px-4 py-2">${visitor.total_spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}