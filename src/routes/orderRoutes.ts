import { Router } from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Protect all routes down below
router.use(protect);

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create a new order from current cart items
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, New York, NY 10001"
 *     responses:
 *       201:
 *         description: Order successfully created and cart cleared
 *       400:
 *         description: Bad request - Empty cart, insufficient stock, or database error
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       404:
 *         description: Not found - One of the products in the cart does not exist
 */
router.route('/')
    .post(createOrder);

/**
 * @openapi
 * /api/orders/my:
 *   get:
 *     summary: Get all orders belonging to the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders sorted by date
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *       500:
 *         description: Internal server error
 */
router.route('/my')
    .get(getMyOrders);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update the shipping/delivery status of an order (Admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique MongoDB ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *                 example: "Shipped"
 *     responses:
 *       200:
 *         description: Order status successfully updated
 *       400:
 *         description: Bad request - Invalid input payload
 *       401:
 *         description: Unauthorized - Requires Admin permissions
 *       404:
 *         description: Not found - Order ID does not match any document
 */
router.route('/:id/status')
    .put(adminOnly, updateOrderStatus);

export default router;
