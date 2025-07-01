import { Request, Response, NextFunction } from 'express';
import { Sale, saleSchema } from '../models/Sale';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Get all sales
export const getSales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sales = await Sale.find()
      .populate('products.productId')
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

// Get sale by ID
export const getSaleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('products.productId')
      .populate('clientId');
    if (!sale) {
      throw new AppError('Venta no encontrada', 404);
    }
    res.json(sale);
  } catch (error) {
    next(error);
  }
};

// Create new sale
export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = saleSchema.parse(req.body);

    // Verificar stock y actualizar productos
    for (const item of validatedData.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(`Producto no encontrado: ${item.productId}`, 404);
      }
      if (product.stock < item.quantity) {
        throw new AppError(`Stock insuficiente para: ${product.name}`, 400);
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const sale = await Sale.create(validatedData);
    res.status(201).json(sale);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Update sale status
export const updateSaleStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['pendiente', 'completada', 'cancelada'].includes(status)) {
      throw new AppError('Estado inválido', 400);
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      throw new AppError('Venta no encontrada', 404);
    }

    // Si se cancela la venta, devolver el stock
    if (status === 'cancelada' && sale.status !== 'cancelada') {
      for (const item of sale.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    sale.status = status;
    await sale.save();
    res.json(sale);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Get sales by date range
export const getSalesByDateRange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      throw new AppError('Fechas requeridas', 400);
    }

    const sales = await Sale.find({
      createdAt: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
    })
      .populate('products.productId')
      .populate('clientId')
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Get sales statistics
export const getSalesStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      throw new AppError('Fechas requeridas', 400);
    }

    const sales = await Sale.find({
      createdAt: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
      status: 'completada',
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    res.json({
      totalSales,
      totalRevenue,
      averageSale,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
}; 