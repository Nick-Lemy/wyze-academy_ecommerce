import { Schema, model } from "mongoose"

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    miniTitle: {
        type: String,
        default: "No subtitle available",
    },
    description: {
        type: String,
        default: "No description available",
    },
    rating: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/150"
    },
    images: {
        type: [String],
        default: []
    },
    features: {
        type: [String],
        default: []
    },
    sku: {
        type: String,
        default: null
    },
    category: {
        type: String,
        default: null
    }
})


const Product = model('product', productSchema)

export default Product;