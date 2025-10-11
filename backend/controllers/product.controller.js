import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../configs/variables.js';
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductById,
    addToFavorites,
    removeFromFavorites,
    removeFromCart,
    addToCart
} from '../models/product.model.js'
import cloudinary from 'cloudinary'


cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

export async function addProductController(req, res) {
    try {
        // Validate required fields
        const { title, price } = req.body;
        if (!title || !price) {
            return res.status(400).send({ error: 'Title and price are required' });
        }

        // Validate price is a positive number
        if (isNaN(price) || parseFloat(price) <= 0) {
            return res.status(400).send({ error: 'Price must be a positive number' });
        }

        // Check if image file is provided
        if (!req.files || !req.files.file) {
            return res.status(400).send({ error: 'Product image is required' });
        }

        const { file } = req.files;
        const product = await createProduct(req.body, file);
        res.status(201).send({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.log(`Error: ${error.message}`)
        if (error.message.includes('duplicate') || error.message.includes('exists')) {
            return res.status(409).send({ error: error.message });
        }
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getProductsController(req, res) {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            minPrice,
            maxPrice,
            priceRange,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            inStock,
            isFeatured,
            tags
        } = req.query;

        const products = await getAllProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            priceRange,
            sortBy,
            sortOrder,
            inStock,
            isFeatured,
            tags
        });

        res.status(200).send({
            success: true,
            ...products
        });
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getProductByIdController(req, res) {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function modifyProductController(req, res) {
    const { id } = req.params;
    const updates = req.body || {};
    console.log(updates)
    try {
        if (req.files && req.files.file) {
            const resultingFile = await cloudinary.v2.uploader.upload(req.files.file.tempFilePath, {
                folder: "products",
            });
            console.log(resultingFile)
            const { secure_url, public_id } = resultingFile
            updates.image = { url: secure_url, public_id };
        }
        const updatedProduct = await updateProduct(id, updates);
        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function removeProductController(req, res) {
    const { id } = req.params;
    try {
        const deletedProduct = await deleteProduct(id);
        if (!deletedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function addToFavoritesController(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const result = await addToFavorites(userId, id);
        res.status(200).send(result);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function removeFromFavoritesController(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const data = await removeFromFavorites(userId, id)
        return res.status(200).send({ data, message: 'Product removed from favorites!' })
    } catch (error) {
        console.log(`Error: ${error.message}`)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}

export async function addToCartController(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    const { quantity } = req.body;
    try {
        const result = await addToCart(userId, id, quantity || 1);
        res.status(200).send(result);
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function removeFromCartController(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const data = await removeFromCart(userId, id)
        return res.status(200).send({ data, message: 'Product removed from cart!' })
    } catch (error) {
        console.log(`Error: ${error.message}`)
        return res.status(500).send({ error: 'Internal Server Error' })
    }
}

export async function getCategoriesController(req, res) {
    try {
        const { getProductCategories } = await import('../models/product.model.js');
        const categoriesData = await getProductCategories();
        res.status(200).send({
            success: true,
            data: categoriesData
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getFeaturedProductsController(req, res) {
    try {
        const { limit = 8 } = req.query;
        const { getFeaturedProducts } = await import('../models/product.model.js');
        const products = await getFeaturedProducts(parseInt(limit));
        res.status(200).send({
            success: true,
            products
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getRelatedProductsController(req, res) {
    try {
        const { id } = req.params;
        const { limit = 4 } = req.query;

        // First get the product to find its category
        const { getProductById, getRelatedProducts } = await import('../models/product.model.js');
        const product = await getProductById(id);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        const relatedProducts = await getRelatedProducts(id, product.category, parseInt(limit));
        res.status(200).send({
            success: true,
            products: relatedProducts
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// Search suggestions/autocomplete
export async function getSearchSuggestionsController(req, res) {
    try {
        const { q, limit = 5 } = req.query;

        if (!q || q.length < 2) {
            return res.status(200).send({
                success: true,
                suggestions: []
            });
        }

        const suggestions = await Product.aggregate([
            {
                $match: {
                    isActive: true,
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { category: { $regex: q, $options: 'i' } },
                        { tags: { $in: [new RegExp(q, 'i')] } }
                    ]
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    image: 1,
                    price: 1
                }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        res.status(200).send({
            success: true,
            suggestions
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// Get available filter options
export async function getFilterOptionsController(req, res) {
    try {
        const [categories, priceRanges, tags] = await Promise.all([
            Product.distinct('category', { isActive: true }),
            Product.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                }
            ]),
            Product.distinct('tags', { isActive: true })
        ]);

        const priceRange = priceRanges[0] || { minPrice: 0, maxPrice: 1000 };

        res.status(200).send({
            success: true,
            filters: {
                categories: categories.filter(cat => cat && cat.trim()),
                priceRange: {
                    min: Math.floor(priceRange.minPrice || 0),
                    max: Math.ceil(priceRange.maxPrice || 1000)
                },
                tags: tags.filter(tag => tag && tag.trim()),
                sortOptions: [
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                    { value: 'name_asc', label: 'Name: A to Z' },
                    { value: 'name_desc', label: 'Name: Z to A' },
                    { value: 'popularity', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' }
                ]
            }
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// Advanced search with faceted results
export async function advancedSearchController(req, res) {
    try {
        const {
            q,
            category,
            minPrice,
            maxPrice,
            inStock,
            page = 1,
            limit = 12,
            sortBy = 'relevance'
        } = req.query;

        // Build aggregation pipeline for faceted search
        const matchStage = { isActive: true };

        if (q) {
            matchStage.$text = { $search: q };
        }

        if (category && category !== 'all') {
            matchStage.category = { $regex: category, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            matchStage.price = {};
            if (minPrice) matchStage.price.$gte = parseFloat(minPrice);
            if (maxPrice) matchStage.price.$lte = parseFloat(maxPrice);
        }

        if (inStock === 'true') {
            matchStage.stock = { $gt: 0 };
        }

        const pipeline = [
            { $match: matchStage },
            {
                $facet: {
                    products: [
                        ...(q ? [{ $addFields: { score: { $meta: 'textScore' } } }] : []),
                        ...(sortBy === 'relevance' && q ? [{ $sort: { score: { $meta: 'textScore' } } }] :
                            sortBy === 'price_asc' ? [{ $sort: { price: 1 } }] :
                                sortBy === 'price_desc' ? [{ $sort: { price: -1 } }] :
                                    [{ $sort: { createdAt: -1 } }]),
                        { $skip: (parseInt(page) - 1) * parseInt(limit) },
                        { $limit: parseInt(limit) },
                        {
                            $project: {
                                title: 1,
                                price: 1,
                                image: 1,
                                category: 1,
                                miniTitle: 1,
                                stock: 1,
                                isFeatured: 1,
                                averageRating: 1,
                                reviewCount: 1
                            }
                        }
                    ],
                    facets: [
                        {
                            $facet: {
                                categories: [
                                    { $group: { _id: '$category', count: { $sum: 1 } } },
                                    { $sort: { count: -1 } }
                                ],
                                priceRanges: [
                                    {
                                        $bucket: {
                                            groupBy: '$price',
                                            boundaries: [0, 50, 100, 250, 500, 1000, 10000],
                                            default: '1000+',
                                            output: { count: { $sum: 1 } }
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    totalCount: [
                        { $count: 'total' }
                    ]
                }
            }
        ];

        const [results] = await Product.aggregate(pipeline);
        const totalCount = results.totalCount[0]?.total || 0;

        res.status(200).send({
            success: true,
            products: results.products,
            facets: results.facets[0] || { categories: [], priceRanges: [] },
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / parseInt(limit)),
                totalCount,
                limit: parseInt(limit),
                hasNextPage: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
                hasPrevPage: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}