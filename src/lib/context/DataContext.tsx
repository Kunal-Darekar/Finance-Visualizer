"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Transaction } from '@/types/transaction';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface DataContextType {
  transactions: Transaction[];
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch transactions and budgets in parallel
      const [transactionsResponse, budgetsResponse] = await Promise.all([
        fetch('/api/transactions'),
        fetch(`/api/budgets?month=${selectedMonth}`)
      ]);

      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }
      if (!budgetsResponse.ok) {
        throw new Error('Failed to fetch budgets');
      }

      const [transactionsData, budgetsData] = await Promise.all([
        transactionsResponse.json(),
        budgetsResponse.json()
      ]);

      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    transactions,
    budgets,
    isLoading,
    error,
    refreshData: fetchData,
    selectedMonth,
    setSelectedMonth
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 