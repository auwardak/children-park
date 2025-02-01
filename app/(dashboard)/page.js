// app/(dashboard)/page.js
'use client';
import { useEffect, useState } from 'react';
import { UsersIcon, CurrencyDollarIcon, ReceiptRefundIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    visitors: 0,
    income: 0,
    expenses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
          <span className="text-sm text-gray-500">Today: {new Date().toLocaleDateString()}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <span className="text-sm text-gray-500">Today: {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Visitors', value: stats.visitors, icon: UsersIcon, color: 'blue' },
          { title: 'Income', value: stats.income, icon: CurrencyDollarIcon, color: 'green' },
          { title: 'Expenses', value: stats.expenses, icon: ReceiptRefundIcon, color: 'red' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className={`text-2xl font-semibold text-${stat.color}-600`}>
                  {typeof stat.value === 'number' ? 
                    stat.title === 'Visitors' ? 
                      stat.value.toLocaleString() : 
                      `$${stat.value.toFixed(2)}` : 
                    'N/A'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.visitors === 0 && stats.income === 0 && stats.expenses === 0 && (
        <div className="mt-12 text-center">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">No data available</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first transaction</p>
            <div className="mt-6">
              <Link href="/dashboard/income" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Transaction
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}