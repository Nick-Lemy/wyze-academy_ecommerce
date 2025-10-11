import { Schema, model } from "mongoose"
import cloudinary from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '../configs/variables.js';
import User from "./user.model.js";

const productSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    miniTitle: {
        type: String,
        default: "No subtitle available",
        trim: true,
        maxLength: [100, 'Mini title cannot exceed 100 characters']
    },
    description: {
        type: String,
        default: "No description available",
        trim: true,
        maxLength: [2000, 'Description cannot exceed 2000 characters']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: [0, 'Review count cannot be negative']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        default: null,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
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
        unique: true,
        sparse: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
        enum: {
            values: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'automotive', 'food', 'other'],
            message: 'Category must be one of: electronics, clothing, books, home, sports, beauty, toys, automotive, food, other'
        }
    },
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    lowStockAlert: {
        type: Number,
        default: 5,
        min: [0, 'Low stock alert cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    weight: {
        type: Number,
        default: null,
        min: [0, 'Weight cannot be negative']
    },
    dimensions: {
        length: { type: Number, default: null },
        width: { type: Number, default: null },
        height: { type: Number, default: null }
    },
    variants: [{
        name: String,
        value: String,
        priceAdjustment: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
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
        console.log(error)
        throw new Error("Error fetching product by id");
    }
}

export async function getAllProducts(options = {}) {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            inStock,
            isFeatured,
            tags,
            priceRange
        } = options;

        // Build query filter
        const filter = { isActive: true }; // Only show active products

        // Enhanced search functionality
        if (search) {
            const searchTerms = search.split(' ').filter(term => term.length > 0);
            const searchConditions = [];

            searchTerms.forEach(term => {
                searchConditions.push(
                    { title: { $regex: term, $options: 'i' } },
                    { description: { $regex: term, $options: 'i' } },
                    { miniTitle: { $regex: term, $options: 'i' } },
                    { category: { $regex: term, $options: 'i' } },
                    { sku: { $regex: term, $options: 'i' } },
                    { tags: { $in: [new RegExp(term, 'i')] } }
                );
            });

            filter.$or = searchConditions;
        }

        // Category filter
        if (category && category !== 'all') {
            filter.category = { $regex: category, $options: 'i' };
        }

        // Price range filters
        if (priceRange && priceRange !== 'all') {
            const ranges = {
                '0-50': { min: 0, max: 50 },
                '51-200': { min: 51, max: 200 },
                '201-500': { min: 201, max: 500 },
                '501-1000': { min: 501, max: 1000 },
                '1000+': { min: 1000, max: null }
            };

            if (ranges[priceRange]) {
                filter.price = {};
                filter.price.$gte = ranges[priceRange].min;
                if (ranges[priceRange].max) {
                    filter.price.$lte = ranges[priceRange].max;
                }
            }
        } else {
            // Custom price range
            if (minPrice !== undefined || maxPrice !== undefined) {
                filter.price = {};
                if (minPrice !== undefined) filter.price.$gte = minPrice;
                if (maxPrice !== undefined) filter.price.$lte = maxPrice;
            }
        }

        // Stock filter
        if (inStock !== undefined) {
            if (inStock === 'true' || inStock === true) {
                filter.stock = { $gt: 0 };
            } else if (inStock === 'false' || inStock === false) {
                filter.stock = { $lte: 0 };
            }
        }

        // Featured filter
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === 'true' || isFeatured === true;
        }

        // Tags filter
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',');
            filter.tags = { $in: tagArray };
        }

        // Build sort object
        const sort = {};

        // Handle special sort cases
        switch (sortBy) {
            case 'price_asc':
                sort.price = 1;
                break;
            case 'price_desc':
                sort.price = -1;
                break;
            case 'name_asc':
                sort.title = 1;
                break;
            case 'name_desc':
                sort.title = -1;
                break;
            case 'newest':
                sort.createdAt = -1;
                break;
            case 'oldest':
                sort.createdAt = 1;
                break;
            case 'popularity':
                // Sort by a combination of factors (could be views, purchases, etc.)
                sort.views = -1;
                sort.createdAt = -1;
                break;
            case 'rating':
                sort.averageRating = -1;
                sort.reviewCount = -1;
                break;
            default:
                sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute queries with aggregation for better performance
        const aggregationPipeline = [
            { $match: filter },
            { $sort: sort },
            {
                $facet: {
                    products: [
                        { $skip: skip },
                        { $limit: parseInt(limit) }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            }
        ];

        const [result] = await Product.aggregate(aggregationPipeline);
        const products = result.products;
        const totalCount = result.totalCount[0]?.count || 0;

        return {
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit: parseInt(limit),
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            },
            filters: {
                search,
                category,
                priceRange,
                minPrice,
                maxPrice,
                inStock,
                isFeatured,
                tags,
                sortBy,
                sortOrder
            }
        };
    } catch (error) {
        console.log(error)
        throw new Error("Error fetching products");
    }
}

export async function deleteProduct(productId) {
    try {
        await Product.findByIdAndDelete(productId);
        return { message: "Product deleted successfully" };
    } catch (error) {
        console.log(error)
        throw new Error("Error deleting product");
    }
}

export async function updateProduct(productId, updateData) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        return updatedProduct;
    } catch (error) {
        console.log(error)
        throw new Error("Error updating product");
    }
}

export async function addToFavorites(userId, productId) {
    try {
        const product = await Product.findById(productId);
        const user = await User.findById(userId);
        console.log(product, user)
        if (!(product && user)) {
            throw new Error("Product or User not found");
        }
        if (user.favorites.includes(productId)) {
            throw new Error("Product already in favorites");
        }
        user.favorites.push(productId);
        await user.save();
        return user;
    } catch (error) {
        console.log(error)
        throw new Error("Error adding to favorites");
    }
}

export async function removeFromFavorites(userId, productId) {
    try {
        const product = await Product.findById(productId); productId
        const user = await User.findById(userId);
        if (!(product && user)) {
            throw new Error('Product or User not found')
        }
        const index = user.favorites.findIndex(id => id === productId)
        if (index === -1) {
            throw new Error('Product is not in favorites')
        }
        const newFavorites = [...user.favorites.slice(0, index), ...user.favorites.slice(index + 1)]
        user.favorites = newFavorites
        await user.save()
        return newFavorites
    } catch (error) {
        console.log(error)
        throw new Error("Error removing from favorites");
    }
}

export async function removeFromCart(userId, productId) {
    try {
        const product = await Product.findById(productId);
        const user = await User.findById(userId);
        if (!(product && user)) {
            throw new Error('Product or User not found')
        }
        const index = user.cart.findIndex(item =>
            typeof item === 'string' ? item === productId : item.productId === productId
        )
        if (index === -1) {
            throw new Error('Product is not in cart')
        }
        const newCart = [...user.cart.slice(0, index), ...user.cart.slice(index + 1)]
        user.cart = newCart
        await user.save()
        return newCart
    } catch (error) {
        console.log(error)
        throw new Error("Error removing from cart");
    }
}

export async function getProductCategories() {
    try {
        const categories = await Product.distinct('category');
        const categoryCounts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        return {
            categories,
            categoryCounts
        };
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching categories");
    }
}

export async function updateProductStock(productId, quantity) {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        product.stock -= quantity;
        if (product.stock < 0) {
            throw new Error("Insufficient stock");
        }

        await product.save();
        return product;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error updating stock");
    }
}

export async function getFeaturedProducts(limit = 8) {
    try {
        const products = await Product.find({
            isActive: true,
            isFeatured: true
        }).limit(limit);

        return products;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching featured products");
    }
}

export async function getRelatedProducts(productId, category, limit = 4) {
    try {
        const products = await Product.find({
            _id: { $ne: productId },
            category: category,
            isActive: true
        }).limit(limit);

        return products;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching related products");
    }
}

export async function addToCart(userId, productId, quantity = 1) {
    try {
        const product = await Product.findById(productId);
        const user = await User.findById(userId);

        if (!(product && user)) {
            throw new Error("Product or User not found");
        }

        // Check if product is active
        if (!product.isActive) {
            throw new Error("Product is not available");
        }

        // Check stock availability
        if (product.stock < quantity) {
            throw new Error(`Insufficient stock. Only ${product.stock} items available`);
        }

        // Check if product already exists in cart
        const existingItemIndex = user.cart.findIndex(item =>
            typeof item === 'string' ? item === productId : item.productId === productId
        );

        let totalQuantity = quantity;
        if (existingItemIndex !== -1) {
            // Calculate total quantity if updating existing item
            const existingQuantity = typeof user.cart[existingItemIndex] === 'string'
                ? 1
                : user.cart[existingItemIndex].quantity;
            totalQuantity = existingQuantity + quantity;

            // Check if total quantity exceeds stock
            if (totalQuantity > product.stock) {
                throw new Error(`Cannot add ${quantity} items. Total would exceed available stock of ${product.stock}`);
            }

            // Update quantity if product already in cart
            if (typeof user.cart[existingItemIndex] === 'string') {
                user.cart[existingItemIndex] = { productId, quantity: totalQuantity };
            } else {
                user.cart[existingItemIndex].quantity = totalQuantity;
            }
        } else {
            // Add new item to cart
            user.cart.push({ productId, quantity });
        }

        await user.save();
        return user;
    } catch (error) {
        console.log(error)
        throw new Error(error.message || "Error adding to cart");
    }
}
