import mongoose, { Schema } from 'mongoose';
import { TransactionCategory, TRANSACTION_CATEGORIES } from '@/types/transaction';

// Define the interface for a Transaction document
export interface ITransaction extends mongoose.Document {
  amount: number;
  description: string;
  date: Date;
  category: TransactionCategory;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Transaction schema
const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: TRANSACTION_CATEGORIES,
      default: 'Other',
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the model
const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction; 