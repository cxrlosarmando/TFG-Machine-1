import GamesModel from '@/models/games';
import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mongodb';

// Definir la respuesta dinámica para la solicitud GET
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Obtener todos los juegos
    const juegos = await GamesModel.find();

    // Devolver la respuesta con los datos de los juegos
    return NextResponse.json({
      message: "Ok",
      data: juegos,
    }, {
      status: 200
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante el proceso
    return NextResponse.json({
      message: "Failed to get juegos",
      error,
    }, {
      status: 500,
    });
  }
}

// Definir la respuesta dinámica para la solicitud POST
export async function POST(request: Request) {
  try {
    const { provider_name, provider, games, status, img } = await request.json();

    // Conectar a la base de datos
    await connectDB();

    // Crear un nuevo proveedor de juegos
    const newGameProvider = await GamesModel.create({
      provider_name: provider_name,
      provider: provider,
      games: games,
      status: status,
      img: img,
    });

    return NextResponse.json({
      message: "Proveedor de Juegos Creado con Éxito",
      data: newGameProvider
    }, { status: 201 });
  } catch (error) {
    console.error("Error al crear el proveedor de juegos:", error);
    return NextResponse.json({
      message: "Error al crear el proveedor de juegos",
      error,
    }, {
      status: 500,
    });
  }
}
