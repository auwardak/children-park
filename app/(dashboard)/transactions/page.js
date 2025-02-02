"use client";

import { useEffect, useState } from "react";
import AddTransactionForm from "@/components/AddTransactionForm";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ date: "", type: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `/api/transactions?page=${currentPage}&limit=${transactionsPerPage}&date=${filter.date}&type=${filter.type}`
      );
      const data = await res.json();
      setTransactions(data.transactions);
      setFilteredTransactions(data.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  // Fetch transactions when the filter or page changes
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filter]);

  // Pagination calculations
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      {/* Add Income and Expense Forms */}
      <AddTransactionForm type="income" onSuccess={fetchTransactions} />
      <AddTransactionForm type="expense" onSuccess={fetchTransactions} />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="p-2 border rounded-md w-full"
        />
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="p-2 border rounded-md w-full"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Source</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : currentTransactions.length > 0 ? (
              currentTransactions.map((t) => (
                <tr key={t.id} className="border">
                  <td className="border p-2">{t.date}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="border p-2">{t.source}</td>
                  <td className="border p-2">${t.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredTransactions.length > transactionsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center">Page {currentPage}</span>
          <button
            disabled={indexOfLastTransaction >= filteredTransactions.length}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredTransactions.length / transactionsPerPage)
                )
              )
            }
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
