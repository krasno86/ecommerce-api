import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { shippingAddress } = req.body;

        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            res.status(400).json({ success: false, error: 'Your cart is empty' });
            return;
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product as any;

            if (!product) {
                res.status(404).json({ success: false, error: 'One of the products no longer exists' });
                return;
            }

            if (product.stock < item.quantity) {
                res.status(400).json({
                    success: false,
                    error: `Not enough stock for ${product.title}. Available: ${product.stock}`
                });
                return;
            }

            totalPrice += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalPrice,
            shippingAddress
        });

        for (const item of cart.items) {
            const product = item.product as any;
            if (product?._id) {
                await Product.findByIdAndUpdate(product._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getMyOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'title price images')
            .sort('-createdAt');

        res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateOrderStatus = async (req: any, res: Response): Promise<void> => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({ success: false, error: 'Order not found' });
            return;
        }

        order.status = status as 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};