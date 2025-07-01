import { Router } from 'express';
import productRoutes from './productRoutes';
import saleRoutes from './saleRoutes';
import clientRoutes from './clientRoutes';

const router = Router();

// API routes
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/clients', clientRoutes);

export default router; 