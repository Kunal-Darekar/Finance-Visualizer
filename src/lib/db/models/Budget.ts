import mongoose, { Schema } from 'mongoose';
import { TransactionCategory, TRANSACTION_CATEGORIES } from '@/types/transaction';

export interface IBudget extends mongoose.Document {
  category: TransactionCategory;
  amount: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: TRANSACTION_CATEGORIES,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      // Validate YYYY-MM format
      validate: {
        validator: (v: string) => /^\d{4}-\d{2}$/.test(v),
        message: 'Month must be in YYYY-MM format',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique category per month
BudgetSchema.index({ category: 1, month: 1 }, { unique: true });

const Budget = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
export default Budget; 