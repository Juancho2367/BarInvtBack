import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const saleProductSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  subtotal: z.number().min(0, 'El subtotal no puede ser negativo'),
});

export const saleSchema = z.object({
  products: z.array(saleProductSchema),
  total: z.number().min(0, 'El total no puede ser negativo'),
  paymentMethod: z.enum(['efectivo', 'credito', 'tarjeta']),
  status: z.enum(['pendiente', 'completada', 'cancelada']),
  clientId: z.string().optional(),
});

// Mongoose schema
const saleMongooseSchema = new Schema({
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser mayor a 0'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo'],
    },
  }],
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo'],
  },
  paymentMethod: {
    type: String,
    enum: ['efectivo', 'credito', 'tarjeta'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'completada', 'cancelada'],
    default: 'pendiente',
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
}, {
  timestamps: true,
});

// Add indexes
saleMongooseSchema.index({ createdAt: -1 });
saleMongooseSchema.index({ status: 1 });
saleMongooseSchema.index({ clientId: 1 });

// Add middleware for stock updates
saleMongooseSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('products')) {
    // TODO: Implementar actualización de stock
    console.log('Actualizando stock...');
  }
  next();
});

export interface ISaleProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ISale extends Document {
  products: ISaleProduct[];
  total: number;
  paymentMethod: 'efectivo' | 'credito' | 'tarjeta';
  status: 'pendiente' | 'completada' | 'cancelada';
  clientId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Sale = mongoose.model<ISale>('Sale', saleMongooseSchema); 