import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// POST para crear una nueva transacción
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", data);

    await connectDB();

    if (!['DEBIT', 'CREDIT'].includes(data.action)) {
      throw new Error('Acción desconocida');
    }

    let newTransactionData: any = {
      action: data.action,
      status: data.status,
      currency: data.currency,
      balance: undefined,
      message: data.message,
      debit: data.action === 'DEBIT' ? data.amount || 0 : 0,
      credit: data.action === 'CREDIT' ? data.amount || 0 : 0,
      user: data.user,
      amount: data.amount,
      round: data.round,
      transaction: data.transaction,
      extra_data: data.extra_data || [],
      game: data.game,
      type: data.type,
      provider: data.provider,
    };

    const lastTransaction = await Transaction.findOne({ id_machine: data.id_machine }).sort({ transaction: -1 });

    if (lastTransaction) {
      newTransactionData.balance = lastTransaction.balance + (newTransactionData.credit || 0) - (newTransactionData.debit || 0);
    } else {
      newTransactionData.balance = newTransactionData.credit || 0;
    }

    console.log("Datos de transacción antes de crear:", newTransactionData);

    const newTransaction = await Transaction.create(newTransactionData);

    return NextResponse.json({
      message: "Transacción Creada con Éxito",
      data: newTransaction
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear la Transacción:", error.message || error);
    return NextResponse.json(
      {
        message: "Error al crear la Transacción",
        error: error.message || error,
      },
      {
        status: 500,
      }
    );
  }
}
