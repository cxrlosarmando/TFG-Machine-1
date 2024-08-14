import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Machine from '@/models/machine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ status: 'ERROR', code: 400, message: 'ID de la máquina es requerido' });
    }

    try {
      await mongoose.connect(process.env.MONGO_URI as string); // Asegúrate de que la variable de entorno esté configurada

      // Obtén la máquina por ID
      const machine = await Machine.findById(id);

      if (!machine) {
        return res.status(404).json({ status: 'ERROR', code: 404, message: 'Máquina no encontrada' });
      }

      const balanceResponse = {
        status: 'OK',
        code: 200,
        data: {
          id_machine: machine.id_machine, // Incluye id_machine en la respuesta
          balance: machine.balance || 0 // Usa un valor predeterminado si el balance es indefinido
        }
      };

      return res.status(200).json(balanceResponse);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'ERROR', code: 500, message: 'Error en el servidor', error });
    }
  } else {
    return res.status(405).json({ status: 'ERROR', code: 405, message: 'Método no permitido' });
  }
}
