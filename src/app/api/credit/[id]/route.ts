import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    if (data.action !== 'CREDIT') {
      throw new Error('Acción no permitida. Solo se permite CREDIT en este endpoint.');
    }

    await connectDB();

    // Hacer una solicitud para obtener el balance actual de la API usando una ruta relativa
    const response = await fetch(`https://casinoenruta.com/api/v1/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud al obtener balance: ${response.statusText}`);
    }

    const balanceData = await response.json();

    // Log para ver el contenido de balanceData
    console.log("Respuesta de la API balance:", balanceData);

    const machineBalance = balanceData.data;

    console.log("Balance de la máquina encontrado:", machineBalance);

    const previousBalance = machineBalance ? machineBalance.balance : 0;
    const newBalance = previousBalance + (data.amount || 0);

    const newTransactionData = {
      action: data.action,
      status: 1,
      currency: data.currency || 'CLP',
      user: id,
      balance: newBalance,
      message: data.message || '',
      debit: 0,
      credit: data.amount || 0,
      amount: data.amount || 0,
      round: data.round || 0,
      transaction: (machineBalance.transaction || 0) + 1,
      extra_data: data.extra_data || [],
      game: data.game || 0,
      type: 1,
      provider: data.provider || 0,
    };

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
    console.error("Error al procesar la solicitud:", error.message);
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
