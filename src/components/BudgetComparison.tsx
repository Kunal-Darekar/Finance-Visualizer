"use client";

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { TRANSACTION_CATEGORIES } from '@/types/transaction';
import { useData } from '@/lib/context/DataContext';

interface BudgetData {
  category: string;
  budget: number;
  actual: number;
}

export default function BudgetComparison() {
  const { transactions, budgets, isLoading, error, selectedMonth, setSelectedMonth } = useData();

  const data = useMemo(() => {
    // Process data
    const budgetMap = new Map(budgets.map(b => [b.category, b.amount]));
    const actualMap = new Map();

    // Calculate actual spending for the selected month
    transactions.forEach(t => {
      const transactionMonth = format(new Date(t.date), 'yyyy-MM');
      if (transactionMonth === selectedMonth) {
        const current = actualMap.get(t.category) || 0;
        actualMap.set(t.category, current + t.amount);
      }
    });

    // Combine data
    return TRANSACTION_CATEGORIES.map(category => ({
      category,
      budget: budgetMap.get(category) || 0,
      actual: actualMap.get(category) || 0,
    }));
  }, [transactions, budgets, selectedMonth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading budget comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
          Select Month
        </label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
            <Bar dataKey="actual" fill="#EF4444" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 