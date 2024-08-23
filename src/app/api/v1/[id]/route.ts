import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';
import Transaction from '@/models/transaction';

// GET Balance for a specific machine (by user ID)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Buscar las transacciones para el usuario específico
    const transactions = await Transaction.find({ user: id }).sort({ transaction: -1 });

    // Si no hay transacciones, devolver balance 0
    if (transactions.length === 0) {
      return NextResponse.json({
        status: 'OK',
        code: 200,
        data: {
          user: id,
          balance: 0
        }
      });
    }

    // Tomar la última transacción para obtener el balance
    const lastTransaction = transactions[0];

    return NextResponse.json({
      status: 'OK',
      code: 200,
      data: {
      //  user: lastTransaction.user,
        balance: lastTransaction.balance
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Failed to get transactions',
      error: error.message,
    }, { status: 500 });
  }
}
