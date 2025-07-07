import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import saleRoutes from './saleRoutes';
import clientRoutes from './clientRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// API routes
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/clients', clientRoutes);
router.use('/reports', reportRoutes);

export default router; 