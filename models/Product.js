const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a product title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a product description'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a product price'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Please add a product category'],
        },
        stock: {
            type: Number,
            required: true,
            default: 10,
        },
        features: {
            type: Map,
            of: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);