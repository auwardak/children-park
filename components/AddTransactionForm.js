"use client";
import { useActionState } from "react";
import { addTransaction } from "@/actions/transactions";
import {
  CurrencyDollarIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";

export default function AddTransactionForm({ type = "income", onSuccess }) {
  const [state, formAction] = useActionState(async (prevState, formData) => {
    formData.append("type", type);
    // Call the server action without passing the client function
    const result = await addTransaction(formData);
    // Once the server action returns on the client, invoke onSuccess if needed
    if (result.success) {
      onSuccess?.();
    }
    return result;
  }, null);
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        {type === "income" ? (
          <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
        ) : (
          <ReceiptRefundIcon className="w-5 h-5 text-red-600" />
        )}
        Add New {type.charAt(0).toUpperCase() + type.slice(1)}
      </h2>
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              type="text"
              name="source"
              required
              placeholder={
                type === "income" ? "Income source" : "Expense source"
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full ${
                type === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white px-4 py-2 rounded-md transition-colors`}
            >
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
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
