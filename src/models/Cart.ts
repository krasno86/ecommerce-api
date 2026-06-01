import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1'],
        default: 1
    }
}, { _id: false });

const cartSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: [cartItemSchema]
    },
    { timestamps: true }
);

export default mongoose.model<ICart>('Cart', cartSchema);