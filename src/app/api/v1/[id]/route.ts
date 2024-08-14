import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
// import Machine from "@/models/machine";
import Transaction from "@/models/transaction";

//GET A ONE TRANSACTION
export async function GET(request: any, { params: { id } }: any) {
    try {
      //conetar a BD
      await connectDB();
      //get data using model
      const transaction = await Transaction.findOne({ _id: id });
      return NextResponse.json(
        {
          message: "Ok",
          data: transaction,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          message: "Failed to fecth a Machine",
          error,
        },
        {
          status: 500,
        }
      );
    }
  }

