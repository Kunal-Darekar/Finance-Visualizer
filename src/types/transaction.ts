export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Other'
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: TransactionCategory;
  createdAt: string;
  updatedAt: string;
} 