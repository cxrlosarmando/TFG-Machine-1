import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// GET ALL Transactions
export async function GET() {
  try {
    await connectDB();

    // Obtiene todas las transacciones
    const transactions = await Transaction.find();

    // Genera respuestas simuladas
    const simulatedResponse = transactions.length > 0 ? {
      status: "OK",
      data: transactions.map(transaction => ({
        // _id: transaction._id,
        // status: transaction.status,
        // id_machine: transaction.id_machine,
        // currency: transaction.currency,
        balance: transaction.balance,
        // message: transaction.message,
        // action: transaction.action,
        credit: transaction.credit,
        // transaction: transaction.transaction
      }))
    } : {
      status: "No transactions found",
      data: []
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
