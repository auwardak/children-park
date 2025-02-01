// components/ProfitLossChart.js
'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';

export default function ProfitLossChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center">Loading chart...</div>;
  if (error) return <div className="h-96 flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => new Date(value).toLocaleString('default', { month: 'short' })}
          />
          <YAxis 
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          />
          <Legend />
          <Bar 
            dataKey="income" 
            name="Total Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="expenses" 
            name="Total Expenses"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            name="Net Profit"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}