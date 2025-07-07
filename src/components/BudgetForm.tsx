"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRANSACTION_CATEGORIES } from '@/types/transaction';
import { format } from 'date-fns';

const budgetSchema = z.object({
  category: z.enum(TRANSACTION_CATEGORIES, {
    required_error: 'Please select a category',
  }),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function BudgetForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: format(new Date(), 'yyyy-MM'),
      category: TRANSACTION_CATEGORIES[0],
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set budget');
      }

      setSuccessMessage('Budget set successfully!');
      reset({
        month: data.month,
        category: TRANSACTION_CATEGORIES[0],
        amount: undefined,
      });

      onSuccess?.();
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          {...register('category')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:ring-2 focus:ring-blue-500`}
        >
          {TRANSACTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            step="0.01"
            id="amount"
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
            className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            } shadow-sm focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
          Month <span className="text-red-500">*</span>
        </label>
        <input
          type="month"
          id="month"
          {...register('month')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.month ? 'border-red-500' : 'border-gray-300'
          } shadow-sm focus:ring-2 focus:ring-blue-500`}
        />
        {errors.month && (
          <p className="text-sm text-red-600">{errors.month.message}</p>
        )}
      </div>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-lg px-4 py-3 text-white font-medium ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Setting Budget...
          </span>
        ) : (
          'Set Budget'
        )}
      </button>
    </form>
  );
} 