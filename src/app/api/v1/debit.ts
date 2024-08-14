import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Machine from '@/models/machine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, amount } = req.body;

  if (req.method === 'POST') {
    if (!id || !amount || typeof amount !== 'number') {
      return res.status(400).json({ status: 'ERROR', code: 400, message: 'ID de la máquina y cantidad son requeridos' });
    }

    try {
      await mongoose.connect(process.env.MONGO_URI as string); // Asegúrate de que la variable de entorno esté configurada

      // Encuentra la máquina por ID y actualiza su balance
      const machine = await Machine.findById(id);

      if (!machine) {
        return res.status(404).json({ status: 'ERROR', code: 404, message: 'Máquina no encontrada' });
      }

      machine.balance = (machine.balance || 0) - amount;
      await machine.save();

      const debitResponse = {
        status: 'OK',
        code: 200,
        data: {
          id_machine: machine.id_machine,
          new_balance: machine.balance
        }
      };

      return res.status(200).json(debitResponse);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'ERROR', code: 500, message: 'Error en el servidor', error });
    }
  } else {
    return res.status(405).json({ status: 'ERROR', code: 405, message: 'Método no permitido' });
  }
}
