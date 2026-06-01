import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    category: mongoose.Types.ObjectId;
    stock: number;
    images: [{ type: String, default: ['/uploads/default-product.jpg'] }];
    features?: Map<string, string>;
}

const productSchema: Schema = new Schema(
    {
        title: { type: String, required: [true, 'Please add a product title'], trim: true },
        description: { type: String, required: [true, 'Please add a product description'] },
        price: { type: Number, required: [true, 'Please add a product price'], min: [0, 'Price cannot be negative'] },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product must belong to a category']
        },
        stock: { type: Number, required: true, default: 10 },
        features: { type: Map, of: String },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);