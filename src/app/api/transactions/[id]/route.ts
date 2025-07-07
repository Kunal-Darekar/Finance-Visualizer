import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Transaction from '@/lib/db/models/Transaction';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const transaction = await Transaction.findById(params.id);
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (err) {
    console.error('Failed to fetch transaction:', err);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const data = await request.json();
    const transaction = await Transaction.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (err) {
    console.error('Failed to update transaction:', err);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await dbConnect();
    const transaction = await Transaction.findByIdAndDelete(params.id);
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Failed to delete transaction:', err);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 