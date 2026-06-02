import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        priceAtPurchase: number;
    }[];
    totalPrice: number;
    shippingAddress: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: Date;
}

const orderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                priceAtPurchase: { type: Number, required: true }
            }
        ],
        totalPrice: { type: Number, required: true },
        shippingAddress: { type: String, required: [true, 'Please add a shipping address'] },
        status: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing'
        }
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);