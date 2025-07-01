import { Request, Response, NextFunction } from 'express';
import { Product, productSchema } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Get all products
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const product = await Product.create(validatedData);
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = productSchema.parse(req.body);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$minStock'] }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Update product stock
export const updateProductStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      throw new AppError('La cantidad debe ser un número', 400);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    product.stock += quantity;
    if (product.stock < 0) {
      throw new AppError('No hay suficiente stock', 400);
    }

    await product.save();
    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
}; 