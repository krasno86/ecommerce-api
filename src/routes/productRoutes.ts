import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, getProduct } from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - category
 *         - stock
 *       properties:
 *         _id:
 *           type: string
 *           description: Automatically generated MongoDB unique identifier
 *           example: 6a1eab4f426e9ebed8e96772
 *         title:
 *           type: string
 *           description: The name of the product (trimmed)
 *           example: Wireless Headphones Sony WH-1000XM4
 *         description:
 *           type: string
 *           description: Detailed description of the product features and specs
 *           example: Full-size over-ear headphones with active noise cancellation and LDAC support.
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Price of the product (cannot be negative)
 *           example: 249.99
 *         category:
 *           type: string
 *           description: Reference to the associated category ID (ObjectId)
 *           example: 64b1f3c5e31d4a2b1c8f9e11
 *         stock:
 *           type: integer
 *           default: 10
 *           description: Available stock count in the inventory
 *           example: 15
 *         images:
 *           type: array
 *           description: List of uploaded image storage file paths
 *           items:
 *             type: string
 *           example: ["/uploads/products/sony-main.jpg"]
 *         features:
 *           type: object
 *           description: Map of dynamic key-value product specifications
 *           additionalProperties:
 *             type: string
 *           example: { "color": "black", "bluetooth_version": "5.0" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Product'
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           description: Total number of records returned in the array
 *           example: 1
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: Validation failed or internal database connection breakdown
 */

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieve products with optional filtering
 *     description: Returns an array of products. Supports full-text search across titles and descriptions, filtering by category ID, and limiting by price ranges.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Query string to match against title or description fields
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId string of a specific product category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Filter items with a price greater than or equal to this value
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter items with a price less than or equal to this value
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Internal server error occurred while querying the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new product (Admin only)
 *     description: Adds a new catalog product to the database. Supports binary file uploads via multipart/form-data. Title, price, and category fields are required.
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
 *                 example: Wireless Headphones Sony WH-1000XM4
 *               description:
 *                 type: string
 *                 example: Full-size over-ear headphones with active noise cancellation.
 *               price:
 *                 type: number
 *                 example: 249.99
 *               stock:
 *                 type: number
 *                 example: 15
 *               category:
 *                 type: string
 *                 description: MongoDB ObjectId string of the associated category
 *                 example: 64b1f3c5e31d4a2b1c8f9e11
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product display image file payload to upload
 *     responses:
 *       201:
 *         description: Product entry successfully initialized and saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid parameters, validation failures, or file upload constraints breached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Access denied due to missing, expired, or invalid Administrator JWT payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: 24-character hexadecimal MongoDB ObjectId string of the product
 *     responses:
 *       200:
 *         description: Product entity fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Supplied product ID payload violates valid string formatting constraints
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No matching product record found in database for the given ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *         description: Unique identity tracking ID of the target product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Wireless Headphones Title
 *               price:
 *                 type: number
 *                 example: 199.99
 *     responses:
 *       200:
 *         description: Product entry successfully modified and current data object returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Validation schema errors caught during entity change processing (e.g. negative price values)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Administrator credential token verification failed or missing
 *       404:
 *         description: Target update record missing from target storage database location
 */
router.route('/:id')
    .get(getProduct)
    .put(protect, adminOnly, updateProduct)
    .delete(protect, adminOnly, deleteProduct);

export default router;
