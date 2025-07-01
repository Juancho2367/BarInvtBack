import { Request, Response, NextFunction } from 'express';
import { Client, clientSchema } from '../models/Client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Get all clients
export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

// Get client by ID
export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      throw new AppError('Cliente no encontrado', 404);
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

// Create new client
export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = clientSchema.parse(req.body);
    const client = await Client.create(validatedData);
    res.status(201).json(client);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Update client
export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = clientSchema.parse(req.body);
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );
    if (!client) {
      throw new AppError('Cliente no encontrado', 404);
    }
    res.json(client);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Delete client
export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      throw new AppError('Cliente no encontrado', 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Update client balance
export const updateClientBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number') {
      throw new AppError('El monto debe ser un número', 400);
    }

    const client = await Client.findById(req.params.id);
    if (!client) {
      throw new AppError('Cliente no encontrado', 404);
    }

    client.currentBalance += amount;
    if (client.currentBalance > client.creditLimit) {
      throw new AppError('Límite de crédito excedido', 400);
    }

    await client.save();
    res.json(client);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    } else {
      next(error);
    }
  }
};

// Get clients with credit limit exceeded
export const getClientsWithExceededCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find({
      $expr: { $gt: ['$currentBalance', '$creditLimit'] }
    });
    res.json(clients);
  } catch (error) {
    next(error);
  }
}; 