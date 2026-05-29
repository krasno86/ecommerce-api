import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: Cannot fetch products'
        });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (Admin only later)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after', // Fixed the deprecation warning here
            runValidators: true,
        });

        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }

        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (Admin only later)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};