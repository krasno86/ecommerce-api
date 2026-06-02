import { Request, Response } from 'express';
import Product from '../models/Product';

// export const getProducts = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const products = await Product.find().populate('category', 'name slug image');
//
//         res.status(200).json({ success: true, data: products });
//     } catch (error: any) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const queryObject: any = {};

        if (req.query.search) {
            const searchStr = req.query.search as string;
            queryObject.$or = [
                { title: { $regex: searchStr, $options: 'i' } },
                { description: { $regex: searchStr, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            queryObject.category = req.query.category;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            queryObject.price = {};
            if (req.query.minPrice) {
                queryObject.price.$gte = Number(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                queryObject.price.$lte = Number(req.query.maxPrice);
            }
        }

        const products = await Product.find(queryObject).populate('category', 'name');

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productData = { ...req.body };
        if (req.file) productData.images = [`/uploads/${req.file.filename}`];
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
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