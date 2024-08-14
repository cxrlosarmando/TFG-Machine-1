import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import Providers from '@/models/providers';

// export async function GET(request: any, { params: { id } }: any) {
//     try {
//       await connectDB();
//       const provider = await Providers.findOne({ _id: id });
//       if (!provider) {
//         return NextResponse.json(
//           {
//             message: "Provider not found",
//           },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(
//         {
//           message: "Ok",
//           data: provider,
//         },
//         { status: 200 }
//       );
//     } catch (error) {
//       return NextResponse.json(
//         {
//           message: "Failed to fetch provider",
//           error: error.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   }


//   export async function PUT(request: any, { params: { id } }: any) {
//     try {
//       // Extraer el status del cuerpo de la solicitud
//       const { status } = await request.json();
  
//       // Conectar a la base de datos
//       await connectDB();
  
//       // Actualizar solo el status del proveedor
//       const updatedProvider = await Providers.findByIdAndUpdate(
//         id, 
//         { status }, // Solo actualizar el campo status
//         { new: true } // Retornar el documento actualizado
//       );
  
//       // Devolver una respuesta exitosa
//       return NextResponse.json(
//         {
//           message: "Proveedor actualizado con éxito",
//           data: updatedProvider,
//         },
//         { status: 200 }
//       );
//     } catch (error) {
//       // Devolver una respuesta de error
//       return NextResponse.json(
//         {
//           message: "Error al actualizar proveedor",
//           error: error.message, // Incluir el mensaje de error para una mejor depuración
//         },
//         { status: 500 }
//       );
//     }
//   }
  
  //GET A ONE OPERATOR
export async function GET(request: any, { params: { id } }: any) {
  try {
    // Conectar a la base de datos (asegúrate de que esta función esté disponible)
    await connectDB();
    // Obtener datos utilizando el modelo
    const providers = await Providers.findOne({ _id: id });
    return NextResponse.json(
      {
        message: "Ok",
        data: providers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error al obtener un operador",
        error,
      },
      {
        status: 500,
      }
    );
  }
}


//ACTUALIZAR
export async function PUT(request: any, { params: { id } }: any) {
  try {
    const { newStatus } = await request.json();

    // Conecta a la base de datos
    await connectDB();

    // Actualiza el proveedor utilizando el método findByIdAndUpdate
    await Providers.findByIdAndUpdate(id, { status: newStatus });

    return NextResponse.json(
      {
        message: "Operador Actualizado con Éxito",
        data: { status: newStatus }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating provider status:", error);
    return NextResponse.json(
      {
        message: "Error al actualizar el Operador",
        error,
      },
      { status: 500 }
    );
  }
}

