"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRANSACTION_CATEGORIES, TransactionCategory } from '@/types/transaction';

const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(100, 'Description must be less than 100 characters'),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(TRANSACTION_CATEGORIES, {
    required_error: 'Please select a category',
  }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSuccess?: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
          date: new Date(data.date).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      setSuccessMessage('Transaction added successfully!');
      reset({
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
      });
      onSuccess?.();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Amount Field */}
      <div className="space-y-1">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            step="0.01"
            id="amount"
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
            className={`pl-8 pr-4 py-3 w-full rounded-lg border ${
              errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            } shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors`}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="description"
          placeholder="Enter transaction description"
          {...register('description')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors`}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Category Field */}
      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors bg-white`}
        >
          {TRANSACTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Date Field */}
      <div className="space-y-1">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          {...register('date')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          } shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-opacity-50 transition-colors`}
        />
        {errors.date && (
          <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
          {successMessage}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={`w-full rounded-lg px-4 py-3 text-white font-medium transition-colors
          ${isSubmitting || !isValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : (
          'Add Transaction'
        )}
      </button>
    </form>
  );
} 