import db from '@/lib/db';
import AddExpenseForm from '@/components/AddExpenseForm';

export default function ExpensesPage() {
  const expenses = db.prepare('SELECT * FROM daily_expenses').all();
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Expenses</h1>
      <AddExpenseForm />
      
      <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{expense.source}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-red-600">
                  -${expense.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}