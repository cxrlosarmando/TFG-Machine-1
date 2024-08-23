import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

export async function POST(request: { json: () => PromiseLike<{ currency?: string; id_machine?: string; balance?: number; message?: string; action: string; debit?: number; credit?: number; user?: string; amount?: number; round?: number; transaction?: number; extra_data?: any[]; game?: number; type?: number; provider?: number; }> }) {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", data);

    await connectDB();

    if (!['DEBIT', 'BALANCE', 'CREDIT'].includes(data.action)) {
      throw new Error('Acción desconocida');
    }

    // Prepara los datos iniciales de la transacción
    let newTransactionData: any = {
      action: data.action,
      status: data.status || 1,
      currency: data.currency || 'CLP',
      id_machine: data.id_machine || '',
      balance: undefined, // Se calculará más tarde
      message: data.message || '',
      debit: data.debit || 0,
      credit: data.credit || 0,
      user: data.user || data.id_machine || '',
      amount: data.debit || data.amount || 0,
      round: data.round || 0,
      transaction: data.transaction || 0,
      extra_data: data.extra_data || [],
      game: data.game || 0,
      type: data.type || 1,
      provider: data.provider || 0,
    };

    // Ajustar el valor de debit o credit según la acción
    if (data.action === 'CREDIT') {
      newTransactionData.credit = data.amount || 0;
      newTransactionData.debit = 0;
    } else if (data.action === 'DEBIT') {
      newTransactionData.debit = data.amount || 0;
      newTransactionData.credit = 0;
    } else if (data.action === 'BALANCE') {
      newTransactionData.debit = 0;
      newTransactionData.credit = 0;
    }

    // Obtener la última transacción para calcular el nuevo balance
    const lastTransaction = await Transaction.findOne({ id_machine: data.id_machine }).sort({ transaction: -1 });

    if (lastTransaction) {
      // Calcula el nuevo balance
      newTransactionData.balance = lastTransaction.balance + (newTransactionData.credit || 0) - (newTransactionData.debit || 0);
    } else {
      // Si no hay transacción anterior, el balance es igual al crédito inicial (o 0 si no hay crédito)
      newTransactionData.balance = newTransactionData.credit || 0;
    }

    console.log("Datos de transacción antes de crear:", newTransactionData);

    // Crear la transacción
    const newTransaction = await Transaction.create(newTransactionData);

    return NextResponse.json({
      status: "OK",
      code: 200,
      data: {
        transaction: newTransaction.transaction,
        balance: newTransaction.balance,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear la Transacción:", error.message || error);
    return NextResponse.json(
      {
        status: "FAILED",
        code: 500,
        data: {
          message: error.message || error,
        },
      },
      {
        status: 500,
      }
    );
  }
}
