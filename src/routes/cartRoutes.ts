import { Router } from 'express';
import { getCart, addToCart, removeFromCart, removeProductGroup } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Retrieve the current user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized - Valid JWT token required
 *   post:
 *     summary: Add an item to the cart or increase its quantity
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "6a1eab4f426e9ebed8e96772"
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product successfully added/updated in cart
 *       400:
 *         description: Bad Request - Invalid inputs
 */
router.route('/')
    .get(getCart)
    .post(addToCart);

/**
 * @openapi
 * /api/cart/{productId}:
 *   delete:
 *     summary: Decrease item quantity by 1 or remove if quantity becomes 0
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to decrease
 *     responses:
 *       200:
 *         description: Product quantity decreased successfully
 *       404:
 *         description: Product or cart not found
 */
router.route('/:productId')
    .delete(removeFromCart);

/**
 * @openapi
 * /api/cart/{productId}/group:
 *   delete:
 *     summary: Completely remove the entire product row from the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove completely
 *     responses:
 *       200:
 *         description: Product row removed entirely from cart
 *       404:
 *         description: Product or cart not found
 */
router.route('/:productId/group')
    .delete(removeProductGroup);

export default router;
