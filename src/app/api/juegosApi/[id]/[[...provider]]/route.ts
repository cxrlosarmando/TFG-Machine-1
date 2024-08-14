import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Machine from "@/models/machine";
import Games from "@/models/games"
import Room from "@/models/room";

export async function PUT(request: any, { params: { id } }: any) {
  try {
    const { status } = await request.json();
    console.log("Datos recibidos:", { status });

    await connectDB();

    const game = await Games.findOneAndUpdate(
      { "games.id": parseInt(id) }, 
      { $set: { "games.$.status": status } }, 
      { new: true }
    );

    if (!game) {
      return NextResponse.json(
        {
          message: "Error al actualizar el juego",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Estado de juego actualizado con éxito",
        data: game,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en la actualización del estado del juego:", error);
    return NextResponse.json(
      {
        message: "Error en la actualización del estado del juego",
      },
      { status: 500 }
    );
  }
}

// export async function PUT(request, { params: { provider } }) {
//   try {
//     const { status } = await request.json(); 

//     await connectDB();

//     console.log('Provider:', provider);  // Debugging line

//     const game = await Games.findOne({ provider }); 

//     if (!game) {
//       return NextResponse.json(
//         {
//           message: "Game not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Actualizamos el estado del juego
//     game.status = status;

//     const updatedGame = await game.save();

//     return NextResponse.json(
//       {
//         message: "Estado de juego actualizado con éxito",
//         data: updatedGame,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: "Error al actualizar el estado del juego",
//         error: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// Ruta para obtener una máquina por id y provider
export async function GET(request: any, { params: { id, provider } }: any) {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Buscar la máquina por id_machine
    const maquina = await Machine.findOne({ id_machine: id });

    // Si no se encuentra la máquina, devolver un mensaje de error
    if (!maquina) {
      return NextResponse.json(
        {
          message: "Machine not found",
        },
        { status: 404 }
      );
    }

    // Poblar los datos de la sala en la máquina
    const maquinaConSala = await Room.populate(maquina, { path: 'room' });

    // Si no se proporciona un proveedor en la URL, devolver todos los juegos de la máquina sin filtrar
    if (!provider) {
      return NextResponse.json(
        {
          message: "Ok",
          data: maquinaConSala,
        },
        { status: 200 }
      );
    }

    // Filtrar los juegos que pertenecen al proveedor específico
    const juegosFiltrados = maquina.games.filter((group: { provider: number; }) => group.provider === parseInt(provider));

    // Clonar el objeto de la máquina y reemplazar los juegos con los juegos filtrados
    const maquinaConJuegosFiltrados = { ...maquinaConSala.toObject(), games: juegosFiltrados };

    // Devolver la respuesta con los juegos filtrados
    return NextResponse.json(
      {
        message: "Ok",
        data: maquinaConJuegosFiltrados,
      },
      { status: 200 }
    );
  } catch (error) {
    // Si ocurre un error, devolver un mensaje de error
    return NextResponse.json(
      {
        message: "Failed to fetch a Machine",
        error,
      },
      { status: 500 }
    );
  }
}