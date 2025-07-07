"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { TRANSACTION_CATEGORIES } from '@/types/transaction';
import { useData } from '@/lib/context/DataContext';

interface EditingTransaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface TransactionListProps {
  onUpdate?: () => void;
}

export default function TransactionList({ onUpdate }: TransactionListProps) {
  const { transactions, isLoading, error, refreshData } = useData();
  const [editingTransaction, setEditingTransaction] = useState<EditingTransaction | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setSuccessMessage('Transaction deleted successfully!');
      refreshData();
      onUpdate?.();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  const handleEdit = (transaction: EditingTransaction) => {
    setEditingTransaction({
      _id: transaction._id,
      amount: transaction.amount,
      description: transaction.description,
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      category: transaction.category,
    });
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(editingTransaction.amount),
          description: editingTransaction.description,
          date: new Date(editingTransaction.date).toISOString(),
          category: editingTransaction.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      setSuccessMessage('Transaction updated successfully!');
      setEditingTransaction(null);
      refreshData();
      onUpdate?.();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Update error:', err);
      alert(err instanceof Error ? err.message : 'Failed to update transaction');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-4 bg-green-50 text-green-600 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                {editingTransaction && editingTransaction._id === transaction._id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        value={editingTransaction.date}
                        onChange={(e) =>
                          setEditingTransaction({
                            ...editingTransaction,
                            date: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingTransaction.description}
                        onChange={(e) =>
                          setEditingTransaction({
                            ...editingTransaction,
                            description: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editingTransaction.category}
                        onChange={(e) =>
                          setEditingTransaction({
                            ...editingTransaction,
                            category: e.target.value,
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        {TRANSACTION_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editingTransaction.amount}
                        onChange={(e) =>
                          setEditingTransaction({
                            ...editingTransaction,
                            amount: parseFloat(e.target.value),
                          })
                        }
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTransaction(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 