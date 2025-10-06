import { Schema, model } from "mongoose"
import cloudinary from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../configs/variables.js';

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
        type: {
            url: String,
            public_id: String
        },
        default: "https://via.placeholder.com/150"
    },
    images: {
        type: [{
            url: String,
            public_id: String
        }],
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


cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})
const Product = model('product', productSchema)

export default Product;



export async function createProduct(body, file) {
    const { title, price, description, miniTitle, category, features, sku } = body;
    const resultingFile = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "products",
    });
    const { secure_url, public_id } = resultingFile
    const product = new Product({ title, price, description, miniTitle, category, features, sku, image: { url: secure_url, public_id } });
    await product.save();
    return product;
}

export async function getProductById(productId) {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    } catch (error) {
        throw new Error("Error fetching product by id");
    }
}

export async function getAllProducts() {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw new Error("Error fetching products");
    }
}

export async function deleteProduct(productId) {
    try {
        await Product.findByIdAndDelete(productId);
        return { message: "Product deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting product");
    }
}

export async function updateProduct(productId, updateData) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        return updatedProduct;
    } catch (error) {
        throw new Error("Error updating product");
    }
}