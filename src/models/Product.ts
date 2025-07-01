import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string().optional(),
  stock: z.number().min(0, 'El stock no puede ser negativo'),
  unit: z.string().min(1, 'La unidad es requerida'),
  supplier: z.string().min(1, 'El proveedor es requerido'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  minStock: z.number().min(0, 'El stock mínimo no puede ser negativo'),
  category: z.string().min(1, 'La categoría es requerida'),
});

// Mongoose schema
const productMongooseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
  },
  description: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
  },
  unit: {
    type: String,
    required: [true, 'La unidad es requerida'],
  },
  supplier: {
    type: String,
    required: [true, 'El proveedor es requerido'],
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
  },
  minStock: {
    type: Number,
    required: [true, 'El stock mínimo es requerido'],
    min: [0, 'El stock mínimo no puede ser negativo'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
  },
}, {
  timestamps: true,
});

// Add indexes
productMongooseSchema.index({ name: 'text' });
productMongooseSchema.index({ category: 1 });
productMongooseSchema.index({ supplier: 1 });

// Add middleware for low stock alerts
productMongooseSchema.pre('save', async function(next) {
  if (this.stock < this.minStock) {
    // TODO: Implementar alerta de stock bajo
    console.log(`Alerta: Stock bajo para ${this.name}`);
  }
  next();
});

export interface IProduct extends Document {
  name: string;
  description?: string;
  stock: number;
  unit: string;
  supplier: string;
  price: number;
  minStock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Product = mongoose.model<IProduct>('Product', productMongooseSchema); 