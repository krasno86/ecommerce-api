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
 *     description: Returns a comprehensive list of all product categories available in the system catalog.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successfully retrieved list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Total number of category records returned
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server Error - Cannot fetch categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Server Error: Cannot fetch categories"
 *   post:
 *     summary: Create a new category (Admin only)
 *     description: Initializes a new product catalog category record. Automatically handles thumbnail file attachment uploads using form multipart data parsing rules.
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
 *                 description: Unique identification display title for the new category item
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Main visual presentation file payload attachment for the category
 *     responses:
 *       201:
 *         description: Category successfully created and persisted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request - Missing configuration fields or validation model failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "E11000 duplicate key error collection: test.categories index: name_1 dup key: { name: \"Electronics\" }"
 *       401:
 *         description: Unauthorized - Valid Admin JWT authentication credentials required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Not authorized to access this route"
 */
router.route('/')
    .get(getCategories)
    .post(protect, adminOnly, upload.single('image'), createCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID with its associated products
 *     description: Resolves target category details metadata using direct primary identity matching constraints, alongside a parallel child collection payload containing all linked system product entries.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The 24-character hexadecimal MongoDB ObjectId string of the target category
 *     responses:
 *       200:
 *         description: Successfully retrieved category details and related product references
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: No category record matches the supplied identifier query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal server error encountered processing relational parsing routines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Cast to ObjectId failed for value..."
 *   put:
 *     summary: Update an existing category (Admin only)
 *     description: Modifies and updates the properties of an established product categorization record. Supports updating text fields and optionally uploading a new file.
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
 *         description: The unique identifier of the target category to modify
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Home Appliances
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image file payload to overwrite current category image
 *     responses:
 *       200:
 *         description: Category entry properties successfully modified and returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request - Validation or storage persistence constraint rules breached
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Validation failed: name is required"
 *       401:
 *         description: Unauthorized - Admin permissions validation sequence failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Not authorized to access this route"
 *       404:
 *         description: Target update catalog category missing from target cluster instance location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *   delete:
 *     summary: Delete a category (Admin only)
 *     description: Purges a targeted product category profile entirely from system records.
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
 *         description: The unique identifier of the category entry scheduled for termination
 *     responses:
 *       200:
 *         description: Category systematically removed from primary dataset clusters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Bad request - Invalid target path key parsing configuration
 *       401:
 *         description: Unauthorized - Privileged clearance check dropped out or expired
 *       404:
 *         description: Target profile missing from cluster instance location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 */
router.route('/:id')
    .get(getCategory)
    .put(protect, adminOnly, upload.single('image'), updateCategory)
    .delete(protect, adminOnly, deleteCategory);


export default router;
