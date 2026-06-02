import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Создать новый заказ из корзины
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const { shippingAddress } = req.body;

        // 1. Находим корзину юзера и популируем данные товаров, чтобы узнать их актуальную цену
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            res.status(400).json({ success: false, error: 'Your cart is empty' });
            return;
        }

        let totalPrice = 0;
        const orderItems = [];

        // 2. Проверяем остатки на складе и формируем элементы заказа
        for (const item of cart.items) {
            const product = item.product as any; // Благодаря populate тут весь объект товара

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

            // Считаем сумму текущего товара
            totalPrice += product.price * item.quantity;

            // Добавляем в массив заказа
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price // Сохраняем цену, за которую юзер РЕАЛЬНО купил товар
            });
        }

        // 3. Создаем заказ в базе
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalPrice,
            shippingAddress
        });

        // 4. Списываем stock у купленных товаров
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity } // Уменьшаем stock на количество в заказе
            });
        }

        // 5. Очищаем корзину юзера
        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Получить историю заказов текущего юзера
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req: any, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'title price images')
            .sort('-createdAt'); // Свежие заказы вверху списка

        res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Обновить статус заказа (Только для админа)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: any, res: Response): Promise<void> => {
    try {
        const { status } = req.body; // 'Shipped', 'Delivered', 'Cancelled'

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404).json({ success: false, error: 'Order not found' });
            return;
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
};