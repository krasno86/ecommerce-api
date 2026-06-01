import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
    .get(getCart)
    .post(addToCart);

router.route('/:productId')
    .delete(removeFromCart);

export default router;