const mongoose = require('mongoose');
const validator = require('validator');


const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        price: Number
    },
    salesPrice: {
        type: Number,
        price: Number
    },
    isActiveOffer: {
        type: String,
        default: false
    },
    productImage: {
        type: Buffer,
        default: null
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;