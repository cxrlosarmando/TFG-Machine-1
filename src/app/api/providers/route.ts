import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import ProvidersModel from "@/models/providers"; // Cambiado el nombre de la importación para evitar conflictos de nombres

export const dynamic = 'force-dynamic'; // Asegura que la página o API sea dinámica

export async function GET(request: Request) {
  try {
    await connectDB();
    const providers = await ProvidersModel.find();
    console.log('Datos obtenidos:', providers); // Añade este log para verificar los datos obtenidos
    return NextResponse.json({
      message: "Ok",
      data: providers,
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    return NextResponse.json({
      message: "Error al obtener los proveedores",
      error: error.message,
    }, {
      status: 500,
    });
  }
}
