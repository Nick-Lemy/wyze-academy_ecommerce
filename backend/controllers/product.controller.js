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
    const { file } = req.files;
    try {
        const product = await createProduct(req.body, file);
        res.status(201).send({ ...product });
    } catch (error) {
        console.log(`Error: ${error.message}`)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function getProductsController(req, res) {
    try {
        const products = await getAllProducts();
        res.status(200).send(products);
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
    try {
        const result = await addToCart(userId, id);
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