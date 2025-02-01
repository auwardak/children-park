// components/ExpensesForm.js
'use client'; // Mark as Client Component

import { useActionState } from 'react';
import { addExpense } from '@/actions/expenses';

export default function ExpensesForm() {
  const [state, formAction] = useActionState(addExpense, null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <input
              type="text"
              name="source"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}