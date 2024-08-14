import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Transaction from "@/models/transaction";

// GET para obtener una transacción específica por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const transaction = await Transaction.findById(id);

    if (transaction) {
      return NextResponse.json({
        status: "OK",
        code: 200,
        data: transaction
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: "Not Found",
        message: "Transaction not found"
      }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "Failed to get transaction",
      error: error.message,
    }, { status: 500 });
  }
}

// PUT para actualizar una transacción específica por ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, data, { new: true });

    if (updatedTransaction) {
      return NextResponse.json({
        status: "OK",
        code: 200,
        data: updatedTransaction
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: "Not Found",
        message: "Transaction not found"
      }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "Failed to update transaction",
      error: error.message,
    }, { status: 500 });
  }
}

// DELETE para eliminar una transacción específica por ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (deletedTransaction) {
      return NextResponse.json({
        status: "OK",
        message: "Transaction deleted successfully"
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: "Not Found",
        message: "Transaction not found"
      }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "Failed to delete transaction",
      error: error.message,
    }, { status: 500 });
  }
}
