import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, getCategory } from '../controllers/categoryController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successfully retrieved list of categories
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Category image file to upload
 *     responses:
 *       201:
 *         description: Category successfully created
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Valid JWT token required
 */
router.route('/')
    .get(getCategories)
    .post(protect, adminOnly, upload.single('image'), createCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID with its associated products
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category
 *     responses:
 *       200:
 *         description: Successfully retrieved category details and related products
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing category (Admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Appliances
 *     responses:
 *       200:
 *         description: Category successfully updated
 *       400:
 *         description: Bad request - Validation or database update error
 *       401:
 *         description: Unauthorized - Valid Admin JWT token required
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category
 *     responses:
 *       200:
 *         description: Category successfully deleted
 *       400:
 *         description: Bad request - Invalid ID configuration
 *       401:
 *         description: Unauthorized - Valid Admin JWT token required
 *       404:
 *         description: Category not found
 */
router.route('/:id')
    .get(getCategory)
    .put(protect, adminOnly, updateCategory)
    .delete(protect, adminOnly, deleteCategory);

export default router;
