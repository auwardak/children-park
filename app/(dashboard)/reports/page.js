// app/(dashboard)/reports/page.js
'use client';
import ProfitLossChart from '@/components/ProfitLossChart';

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Financial Reports</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium mb-4">Profit & Loss Overview</h2>
        <ProfitLossChart />
      </div>
    </div>
  );
}