const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');

// Route for /api/products
router.route('/')
    .get(getProducts)
    .post(createProduct);

module.exports = router;