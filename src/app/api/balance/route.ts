import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// GET para obtener todos los balances de los usuarios (máquinas)
export async function GET() {
  try {
    await connectDB();

    // Obtener todas las transacciones
    const transactions = await Transaction.find();
    console.log("Transacciones obtenidas:", transactions);

    if (transactions.length === 0) {
      return NextResponse.json({
        status: "No Data",
        message: "No transactions found in the database"
      }, { status: 404 });
    }

    // Crear un objeto para almacenar los balances finales por usuario
    const finalBalances: Record<string, { balance: number }> = {};

    transactions.forEach(transaction => {
      const { user, balance } = transaction.toObject(); // Convierte a objeto plano
      if (user) {
        finalBalances[user] = { balance }; // Asigna el balance al user
      }
    });

    console.log("Balances finales:", finalBalances);

    return NextResponse.json({
      status: "OK",
      code: 200,
      data: finalBalances
    }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener balances:", error.message);
    return NextResponse.json({
      status: "Failed to get balances",
      error: error.message,
    }, { status: 500 });
  }
}
