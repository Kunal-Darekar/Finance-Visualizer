import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Transaction from '@/lib/db/models/Transaction';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;
    const transaction = await Transaction.findById(id);
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;
    const data = await request.json();
    const transaction = await Transaction.findByIdAndUpdate(
      id,
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

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;
    const transaction = await Transaction.findByIdAndDelete(id);
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