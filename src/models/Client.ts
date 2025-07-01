import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  creditLimit: z.number().min(0, 'El límite de crédito no puede ser negativo'),
  currentBalance: z.number().min(0, 'El balance actual no puede ser negativo'),
});

// Mongoose schema
const clientMongooseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido'],
  },
  phone: {
    type: String,
    trim: true,
  },
  creditLimit: {
    type: Number,
    required: [true, 'El límite de crédito es requerido'],
    min: [0, 'El límite de crédito no puede ser negativo'],
  },
  currentBalance: {
    type: Number,
    required: [true, 'El balance actual es requerido'],
    min: [0, 'El balance actual no puede ser negativo'],
  },
}, {
  timestamps: true,
});

// Add indexes
clientMongooseSchema.index({ name: 'text' });
clientMongooseSchema.index({ email: 1 }, { unique: true, sparse: true });
clientMongooseSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Add middleware for credit limit checks
clientMongooseSchema.pre('save', async function(next) {
  if (this.currentBalance > this.creditLimit) {
    // TODO: Implementar alerta de límite de crédito excedido
    console.log(`Alerta: Límite de crédito excedido para ${this.name}`);
  }
  next();
});

export interface IClient extends Document {
  name: string;
  email?: string;
  phone?: string;
  creditLimit: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export const Client = mongoose.model<IClient>('Client', clientMongooseSchema); 