import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .get(getProducts)
    .post(protect, adminOnly, createProduct);

router.route('/:id')
    .put(protect, adminOnly, updateProduct)
    .delete(protect, adminOnly, deleteProduct);

export default router;