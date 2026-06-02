import { Router } from 'express';
import {getProducts, createProduct, updateProduct, deleteProduct, getProduct} from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.route('/')
    .get(getProducts)
    .post(protect, adminOnly, upload.single('image'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, adminOnly, updateProduct)
    .delete(protect, adminOnly, deleteProduct);

export default router;