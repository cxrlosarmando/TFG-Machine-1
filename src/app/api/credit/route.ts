import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", data);

    await connectDB();

    if (data.action !== 'CREDIT') {
      throw new Error('Acción no permitida. Solo se permite CREDIT en este endpoint.');
    }

    const creditAmount = Number(data.credit) || 0;  // Asegúrate de que sea un número

    // Verifica si el valor de crédito es 0
    if (creditAmount <= 0) {
      throw new Error('El monto de crédito debe ser mayor que 0.');
    }

    const user = data.user ? data.user.toUpperCase() : (data.id_machine || '').toUpperCase();
    console.log("Usuario:", user);

    const lastTransaction = await Transaction.findOne({ id_machine: data.id_machine }).sort({ transaction: -1 });
    console.log("Última transacción:", lastTransaction);

    const previousBalance = lastTransaction?.balance || 0;
    const newBalance = previousBalance + creditAmount;
    console.log("Balance anterior:", previousBalance, "Nuevo balance:", newBalance);

    const newTransactionData = {
      action: data.action,
      status: 1,
      currency: data.currency || ['CLP'],
      id_machine: data.id_machine,
      balance: newBalance,
      message: data.message || '',
      debit: 0,
      credit: creditAmount,
      user: user,
      amount: creditAmount,
      round: data.round || 0,
      transaction: (lastTransaction?.transaction || 0) + 1,
      extra_data: data.extra_data || [],
      game: data.game || 0,
      type: 1,
      provider: data.provider || 0,
    };

    console.log("Datos de la nueva transacción:", newTransactionData);

    const newTransaction = await Transaction.create(newTransactionData);
    console.log("Transacción creada:", newTransaction);

    return NextResponse.json({
      status: "OK",
      code: 200,
      data: {
        transaction: newTransaction.transaction,
        balance: newTransaction.balance,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear la transacción de crédito:", error.message || error);
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
