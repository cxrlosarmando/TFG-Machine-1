import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";
import Room from "@/models/room";

export const dynamic = 'force-dynamic'; // Asegura que la página o API sea dinámica
// GET ALL Machines and Their Balances with Currency
export async function GET() {
  try {
    await connectDB();

    // Obtiene todas las transacciones
    const transactions = await Transaction.find().sort({ user: 1, transaction: -1 });

    // Crear un objeto donde cada user es una clave con el balance más reciente
    const machineBalances = transactions.reduce((acc, transaction) => {
      const { user, balance } = transaction;
      if (!acc[user] || transaction.transaction > acc[user].transaction) {
        acc[user] = { balance, transaction: transaction.transaction };
      }
      return acc;
    }, {});

    // Obtener la moneda para cada máquina
    const machineIds = Object.keys(machineBalances);
    const rooms = await Room.find({ id_machine: { $in: machineIds } });

    // Crear un mapa para cada máquina con su moneda asociada
    const roomMap = rooms.reduce((acc, room) => {
      room.id_machine.forEach(id => {
        if (machineBalances[id]) {
          acc[id] = room.currency[0] || 'Unknown'; // Asumimos que queremos la primera moneda del array
        }
      });
      return acc;
    }, {});

    // Crear los datos de respuesta incluyendo la moneda
    const data = Object.keys(machineBalances).map(user => ({
      user,
      balance: machineBalances[user].balance,
      currency: roomMap[user] || 'Unknown' // Default to 'Unknown' if no currency found
    }));

    const simulatedResponse = data.length > 0 ? {
      status: "OK",
      code: 200,
      data
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
