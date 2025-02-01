'use client';
import { useEffect, useState } from 'react';
import AddIncomeForm from '@/components/AddIncomeForm';

export default function IncomePage() {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch('/api/income');
        const data = await response.json();
        setIncome(data);
      } catch (error) {
        console.error('Error fetching income data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daily Income Tracking</h1>
      <AddIncomeForm onSuccess={() => fetchIncome()} />
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-100 rounded-lg"></div>
          <div className="h-48 bg-gray-100 rounded-lg"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {income.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                    ${Number(entry.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
              {income.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No income records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}