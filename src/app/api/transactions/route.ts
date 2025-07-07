import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Transaction from '@/lib/db/models/Transaction';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    await dbConnect();
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .select('-__v')
      .lean();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transaction fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    if (!data.amount || !data.description || !data.date || !data.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create(data);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Transaction creation error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Invalid transaction data',
          details: error.message
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Failed to create transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 