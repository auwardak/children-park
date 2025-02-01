'use client';
import { useFormState } from 'react-dom';
import { addExpense } from '@/actions/expenses';

export default function AddExpenseForm() {
  const [state, formAction] = useFormState(addExpense, null);

  return (
    <form action={formAction} className="bg-white p-4 rounded shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="date" name="date" required className="p-2 border rounded" />
        <input type="text" name="source" placeholder="Source" required className="p-2 border rounded" />
        <input type="number" name="amount" placeholder="Amount" step="0.01" required className="p-2 border rounded" />
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Expense
      </button>
    </form>
  );
}