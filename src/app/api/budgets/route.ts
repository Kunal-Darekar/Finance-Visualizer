import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Budget from '@/lib/db/models/Budget';
import { MongoServerError } from 'mongodb';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    // Validate month format
    if (month && !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    const query = month ? { month } : {};
    const budgets = await Budget.find(query)
      .sort({ category: 1 })
      .select('-__v')
      .lean();

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Budget fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch budgets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate required fields
    if (!data.category || !data.amount || !data.month) {
      return NextResponse.json(
        { error: 'Missing required fields: category, amount, and month are required' },
        { status: 400 }
      );
    }

    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(data.month)) {
      return NextResponse.json(
        { error: 'Invalid month format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    const budget = await Budget.create(data);
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Budget creation error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Invalid budget data',
          details: error.message
        },
        { status: 400 }
      );
    }
    // Handle duplicate key error (same category and month)
    if (error instanceof Error && error.name === 'MongoError' && (error as MongoServerError).code === 11000) {
      return NextResponse.json(
        { 
          error: 'Budget for this category and month already exists',
          details: 'Use PUT request to update existing budget'
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Failed to create budget',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 