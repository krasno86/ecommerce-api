import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProduct } from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieve products with optional filtering
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for matching text in title or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter products
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price limit
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price limit
 *     responses:
 *       200:
 *         description: Successfully retrieved list of filtered products
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Wireless Headphones
 *               description:
 *                 type: string
 *                 example: High-quality over-ear noise-cancelling headphones
 *               price:
 *                 type: number
 *                 example: 99.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 description: MongoDB ID of the category
 *                 example: 6a1eab4f426e9ebed8e96772
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Main product image file to upload
 *     responses:
 *       201:
 *         description: Product successfully created
 *       400:
 *         description: Bad request - Validation or processing failure
 *       401:
 *         description: Unauthorized - Valid Admin JWT token required
 */
router.route('/')
    .get(getProducts)
    .post(protect, adminOnly, upload.single('image'), createProduct);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique product identifier
 *     responses:
 *       201:
 *         description: Successfully retrieved product details
 *       400:
 *         description: Bad request - Invalid ID formatting
 *   put:
 *     summary: Update an existing product (Admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique product identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Headphone Name
 *               price:
 *                 type: number
 *                 example: 89.99
 *     responses:
 *       200:
 *         description: Product successfully updated
 *       400:
 *         description: Bad request - Update logic failure
 *       401:
 *         description: Unauthorized - Admin credentials needed
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product from inventory (Admin only)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique product identifier
 *     responses:
 *       200:
 *         description: Product successfully removed
 *       400:
 *         description: Bad request - Data processing error
 *       401:
 *         description: Unauthorized - Admin credentials needed
 *       404:
 *         description: Product not found
 */
router.route('/:id')
    .get(getProduct)
    .put(protect, adminOnly, updateProduct)
    .delete(protect, adminOnly, deleteProduct);

export default router;
