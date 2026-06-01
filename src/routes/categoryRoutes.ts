import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, getCategory } from '../controllers/categoryController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .get(getCategories)
    .post(protect, adminOnly, createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, adminOnly, updateCategory)
    .delete(protect, adminOnly, deleteCategory);

export default router;