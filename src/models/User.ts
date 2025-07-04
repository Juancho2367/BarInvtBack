import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Zod schema for validation
export const userSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').max(50, 'El usuario no puede exceder 50 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'user', 'manager']).default('user'),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Mongoose schema
const userMongooseSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El usuario no puede exceder 50 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'manager'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes are already defined in the schema with unique: true

// Hash password before saving
userMongooseSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userMongooseSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userMongooseSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const User = mongoose.model<IUser>('User', userMongooseSchema); 