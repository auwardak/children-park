// components/AddIncomeForm.js
'use client';
import { useActionState } from 'react';
import { addIncome } from '@/actions/income';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function AddIncomeForm({ onSuccess }) {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    const result = await addIncome(formData);
    if (result.success) {
      onSuccess?.();
    }
    return result;
  }, null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
        Add New Income
      </h2>
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              type="text"
              name="source"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Income source"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Income
            </button>
          </div>
        </div>
        {state?.error && (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        )}
      </form>
    </div>
  );
}