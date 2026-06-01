import { Request, Response } from 'express';
import Category from '../models/Category';
import Product from "../models/Product";

// @desc    Create a category
// @route   POST /api/category
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update a category
// @route   PUT /api/category/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });

        if (!category) {
            res.status(404).json({ success: false, error: 'Category not found' });
            return;
        }

        res.status(200).json({ success: true, data: category });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/category/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get a categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error: Cannot fetch products'
        });
    }
};

// @desc    Get single category AND all its products
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(404).json({ success: false, error: 'Category not found' });
            return;
        }

        const products = await Product.find({ category: req.params.id });

        res.status(200).json({
            success: true,
            data: {
                category,
                products
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};