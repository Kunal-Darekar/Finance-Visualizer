"use client";

import { useMemo } from 'react';
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import BudgetForm from "@/components/BudgetForm";
import BudgetComparison from "@/components/BudgetComparison";
import { useData } from "@/lib/context/DataContext";

export default function Home() {
  const { transactions, isLoading, error, refreshData } = useData();

  const { totalExpenses, recentTransactions } = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    return { totalExpenses: total, recentTransactions: recent };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-16 max-w-[1920px]">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your financial dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-8 py-16 max-w-[1920px]">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-16 max-w-[1920px] space-y-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h3 className="text-2xl font-medium text-gray-900">Total Expenses</h3>
          <p className="mt-6 text-5xl font-bold text-blue-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h3 className="text-2xl font-medium text-gray-900">Recent Activity</h3>
          {recentTransactions.length > 0 ? (
            <ul className="mt-6 space-y-6">
              {recentTransactions.slice(0, 3).map((t) => (
                <li key={t._id} className="text-base text-gray-600">
                  {new Date(t.date).toLocaleDateString()}: {t.description} (${t.amount.toFixed(2)})
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-gray-500">No recent transactions</p>
          )}
        </div>
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h3 className="text-2xl font-medium text-gray-900">Quick Stats</h3>
          <p className="mt-6 text-base text-gray-600">
            Total Transactions: {transactions.length}
          </p>
        </div>
      </div>

      {/* Budget Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-semibold mb-12">Set Category Budget</h2>
          <BudgetForm onSuccess={refreshData} />
        </div>
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-semibold mb-12">Budget vs Actual</h2>
          <BudgetComparison />
        </div>
      </div>

      {/* Charts and Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-semibold mb-12">Add Transaction</h2>
          <TransactionForm onSuccess={refreshData} />
        </div>
        <div className="bg-white p-16 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-semibold mb-12">Monthly Expenses</h2>
          <MonthlyExpensesChart />
        </div>
      </div>

      {/* Category Chart */}
      <div className="bg-white p-16 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-semibold mb-12">Expenses by Category</h2>
        <CategoryPieChart />
      </div>

      {/* Transactions List */}
      <div className="bg-white p-16 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-semibold mb-12">Recent Transactions</h2>
        <TransactionList onUpdate={refreshData} />
      </div>
    </div>
  );
}
