import { Response } from 'express';
import Cart from '../models/Cart';

const getOrCreateCart = async (userId: string) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

export const getCart = async (req: any, res: Response): Promise<void> => {
    try {
        // Find cart and fill product details (title, price, image)
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'title price images stock');

        if (!cart) {
            res.status(200).json({ success: true, data: { items: [] } });
            return;
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const addToCart = async (req: any, res: Response): Promise<void> => {
    try {
        const { productId, quantity = 1 } = req.body;
        const cart = await getOrCreateCart(req.user.id);
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity) });
        }

        await cart.save();

        const updatedCart = await cart.populate('items.product', 'title price images');
        res.status(200).json({ success: true, data: updatedCart });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const removeFromCart = async (req: any, res: Response): Promise<void> => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            res.status(404).json({ success: false, error: 'Cart not found' });
            return;
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};