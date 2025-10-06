import { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById } from '../models/product.model.js'

export async function addProductController(req, res) {
    const { file } = req.files;
    try {
        const product = await createProduct(req.body, file);
        res.status(201).send({ ...product });
    } catch (error) {
        res.status(500).send({ error: `Error: ${error.message}` });
    }
}

export async function getProductsController(req, res) {
    try {
        const products = await getAllProducts();
        res.status(200).send(products);
    } catch (error) {
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
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

export async function modifyProductController(req, res) {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedProduct = await updateProduct(id, updates);
        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(500).send({ error: `Error: ${error.message}` });
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
        res.status(500).send({ error: `Error: ${error.message}` });
    }
}