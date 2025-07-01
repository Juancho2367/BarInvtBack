import { Router } from 'express';
import {
  getSales,
  getSaleById,
  createSale,
  updateSaleStatus,
  getSalesByDateRange,
  getSalesStatistics,
} from '../controllers/saleController';

const router = Router();

// Sale routes
router.get('/', getSales);
router.get('/:id', getSaleById);
router.post('/', createSale);
router.patch('/:id/status', updateSaleStatus);
router.get('/date-range', getSalesByDateRange);
router.get('/statistics', getSalesStatistics);

export default router; 