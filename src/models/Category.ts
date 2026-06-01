import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    image: string;
}

const categorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a category name'],
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        image: {
            type: String,
            default: '/uploads/default-category.jpg'
        }
    },
    { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);