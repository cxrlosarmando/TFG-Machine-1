import mongoose, { Schema, Document, model } from "mongoose";

// Interfaz para el modelo de transacción
interface Transaction extends Document {
  action: "DEBIT" | "BALANCE" | "CREDIT";
  user?: string;
  amount?: number;
  round?: number;
  transaction?: number;
  currency?: string[];
  extra_data?: any[];
  game?: number;
  type?: number;
  provider?: number;
  status?: number;
  id_machine: string;
  balance?: number;
  message?: string;
  debit?: number;
  credit?: number;
}

// Interfaz para el modelo con métodos estáticos
interface TransactionModel extends mongoose.Model<Transaction> {
  formatBalance(balance: number): string;
}

// Función para truncar a decimales
function truncateToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

// Esquema de transacción
const TransactionSchema = new Schema<Transaction>({
  id_machine: { type: String, required: true },
  status: { type: Number, default: 1 },
  currency: { type: [String], required: false },
  extra_data: { type: [Schema.Types.Mixed], default: [] },
  balance: {
    type: Number,
    default: 0,
    get: (value: number) => parseFloat(value?.toFixed(2) || '0.00'),
    set: (value: number) => truncateToDecimals(value, 2),
  },
  message: { type: String, required: false },
  action: { 
    type: String, 
    enum: ["DEBIT", "BALANCE", "CREDIT"], 
    required: true 
  },
  debit: { type: Number, required: false },
  credit: { type: Number, required: false },
  transaction: { type: Number, required: false },
  user: { type: String, required: true },
  amount: { type: Number, required: false },
  round: { type: Number, required: false },
  game: { type: Number, required: false },
  type: { type: Number, required: false },
  provider: { type: Number, required: false },
});

// Middleware para actualizar el balance antes de guardar
TransactionSchema.pre('save', async function (next) {
  try {
    // Asegúrate de que la acción sea válida y de que los campos credit/debit se asignen correctamente
    if (this.action === 'CREDIT') {
      this.credit = this.amount || 0;  // Asigna el valor de credit basado en el monto si la acción es CREDIT
      this.debit = 0; // Asegúrate de que debit sea 0
    } else if (this.action === 'DEBIT') {
      this.debit = this.amount || 0;  // Asigna el valor de debit basado en el monto si la acción es DEBIT
      this.credit = 0; // Asegúrate de que credit sea 0
    } else if (this.action === 'BALANCE') {
      this.credit = 0;
      this.debit = 0; // Para acciones de balance, ambos deben ser 0
    }

    if (this.isNew) {
      const lastTransaction = await this.constructor.findOne({ user: this.user }).sort({ transaction: -1 });

      if (lastTransaction) {
        this.transaction = (lastTransaction.transaction || 0) + 1;
        this.balance = (lastTransaction.balance || 0) + this.credit - this.debit;
      } else {
        // Si no hay transacciones anteriores para este user, comienza desde cero
        this.transaction = 1;
        this.balance = this.credit || 0; // Balance inicial es igual al crédito si no hay transacción previa
      }
    } else {
      // Actualización de una transacción existente
      this.balance = (this.balance || 0) + this.credit - this.debit;
    }

    // Trunca el balance a 2 decimales
    this.balance = truncateToDecimals(this.balance, 2);
    
    next();
  } catch (error) {
    return next(error);
  }
});



// Método estático para formatear balance
TransactionSchema.statics.formatBalance = function (balance: number): string {
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(balance);
};

// Inicializa el modelo
const Transaction = mongoose.models.Transaction || model<Transaction, TransactionModel>("Transaction", TransactionSchema);

export default Transaction;
