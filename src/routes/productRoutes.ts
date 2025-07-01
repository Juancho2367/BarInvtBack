import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateProductStock,
} from '../controllers/productController';

const router = Router();

// Product routes
router.get('/', getProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id/stock', updateProductStock);

export default router; 