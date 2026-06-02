import { Router } from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
    .post(createOrder);

router.route('/my')
    .get(getMyOrders);

router.route('/:id/status')
    .put(adminOnly, updateOrderStatus);

export default router;