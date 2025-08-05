import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string().optional(),
  stock: z.number().min(0, 'El stock no puede ser negativo'),
  unit: z.string().min(1, 'La unidad es requerida'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  minStock: z.number().min(0, 'El stock mínimo no puede ser negativo'),
  category: z.string().optional().default('Sin categoría'),
  barcode: z.string().optional(),
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
  barcode: {
    type: String,
    unique: true,
    sparse: true, // Permite que productos sin código de barras coexistan
    trim: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for id field
productMongooseSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
productMongooseSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Add indexes
productMongooseSchema.index({ name: 'text' });
productMongooseSchema.index({ category: 1 });

// Add middleware for low stock alerts and auto-assign id
productMongooseSchema.pre('save', async function(next) {
  // Verificar stock bajo solo si el stock cambió
  if (this.isModified('stock') && this.stock <= this.minStock) {
    const logger = require('../utils/logger').logger;
    logger.warn(`🚨 ALERTA DE STOCK BAJO: ${this.name} tiene ${this.stock} ${this.unit} (mínimo: ${this.minStock})`);
  }
  
  // Auto-asignar ID para productos nuevos (si es nuevo documento)
  if (this.isNew) {
    // El virtual 'id' se asignará automáticamente basado en _id
    // No necesitamos hacer nada especial, solo asegurar que el virtual funcione
  }
  
  next();
});

export interface IProduct extends Document {
  id: string;
  name: string;
  description?: string;
  stock: number;
  unit: string;
  price: number;
  minStock: number;
  category: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Product = mongoose.model<IProduct>('Product', productMongooseSchema); 