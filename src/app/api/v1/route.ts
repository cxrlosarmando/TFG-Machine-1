import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// GET ALL Transactions
export async function GET() {
  try {
    await connectDB();

    // Obtiene todas las transacciones
    const transactions = await Transaction.find();

    // Crear un objeto 'data' donde cada transacción es un objeto anidado
    let data = {};

    transactions.forEach((transaction, index) => {
      data = {
        // transaction: transaction.transaction,
        balance: transaction.balance,
        // Agrega más campos si es necesario
      };
    });

    const simulatedResponse = transactions.length > 0 ? {
      status: "OK",
      code: 200,
      data: data
    } : {
      status: "No transactions found",
      data: {}
    };

    return NextResponse.json(simulatedResponse, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Failed to get transactions",
      error: error.message,
    }, {
      status: 500,
    });
  }
}

export async function POST(request: { json: () => PromiseLike<{ status?: number; currency?: string[]; id_machine?: string; balance?: number; message?: string; action: string; debit?: number; credit?: number; user?: string; amount?: number; round?: number; transaction?: number; extra_data?: any[]; game?: number; type?: number; provider?: number; }> }) {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", data);

    // Conectar a la base de datos
    await connectDB();

    // Validación básica
    if (!['DEBIT', 'BALANCE', 'CREDIT'].includes(data.action)) {
      throw new Error('Acción desconocida');
    }

    // Prepara los datos iniciales de la transacción
    let newTransactionData: any = {
      action: data.action,
      status: data.status,
      currency: data.currency,
      // id_machine: data.id_machine,
      balance: undefined, // Se calculará más tarde
      message: data.message,
      debit: undefined, // Se asignará según la acción
      credit: undefined, // Se asignará según la acción
      user: data.user,
      amount: data.amount,
      round: data.round,
      transaction: data.transaction,
      extra_data: data.extra_data || [],
      game: data.game,
      type: data.type,
      provider: data.provider,
    };

    // Manejo de acciones
    if (data.action === 'CREDIT') {
      newTransactionData.credit = data.amount || 0;
      newTransactionData.debit = 0; // El débito es 0 en una transacción de crédito
    } else if (data.action === 'DEBIT') {
      newTransactionData.debit = data.amount || 0;
      newTransactionData.credit = 0; // El crédito es 0 en una transacción de débito
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



// export async function DELETE(request: { nextUrl: { searchParams: { get: (arg0: string) => any; }; }; }){
//   try {
//       const id = request.nextUrl.searchParams.get("_id");
//       await connectDB();
//       await  Room.findByIdAndDelete(id);
      
//       return NextResponse.json(
//           {
//             message: "Sala eliminada Satisfactoriamente",
//           },
//           { status: 200 }
//         );
      
//   } catch (error) {
//       return NextResponse.json(
//           {
//             message: "Fallo al eliminar Sala",
//             error,
//           },
//           {
//             status: 500,
//           }
//         );
//   }
// }