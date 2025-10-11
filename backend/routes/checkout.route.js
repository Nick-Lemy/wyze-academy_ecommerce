import { Router } from "express";
import { userMiddleware } from "../middlewares/auth.middleware.js";

const checkoutRouter = Router();

// Apply user middleware to all checkout routes
checkoutRouter.use(userMiddleware);

// Validate cart before checkout
checkoutRouter.post('/validate', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).send({ error: "Cart is empty" });
        }

        const { default: Product } = await import('../models/product.model.js');
        const validationResults = [];
        let totalPrice = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);

            const result = {
                productId: item.productId,
                requestedQuantity: item.quantity,
                isValid: true,
                issues: []
            };

            if (!product) {
                result.isValid = false;
                result.issues.push('Product not found');
            } else {
                if (!product.isActive) {
                    result.isValid = false;
                    result.issues.push('Product is no longer available');
                }

                if (product.stock < item.quantity) {
                    result.isValid = false;
                    result.issues.push(`Only ${product.stock} items available`);
                    result.availableQuantity = product.stock;
                }

                if (result.isValid) {
                    result.price = product.price;
                    result.title = product.title;
                    totalPrice += product.price * item.quantity;
                }
            }

            validationResults.push(result);
        }

        const isCartValid = validationResults.every(item => item.isValid);

        // Calculate totals
        const tax = totalPrice * 0.1; // 10% tax
        const shipping = totalPrice > 100 ? 0 : 10; // Free shipping over $100
        const total = totalPrice + tax + shipping;

        res.status(200).send({
            success: true,
            isValid: isCartValid,
            validationResults,
            totals: {
                subtotal: totalPrice,
                tax,
                shipping,
                total
            }
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Calculate shipping options
checkoutRouter.post('/shipping', async (req, res) => {
    try {
        const { shippingAddress, totalPrice } = req.body;

        if (!shippingAddress) {
            return res.status(400).send({ error: "Shipping address is required" });
        }

        // Mock shipping options (in real app, integrate with shipping provider)
        const shippingOptions = [
            {
                id: 'standard',
                name: 'Standard Delivery',
                description: '5-7 business days',
                price: totalPrice > 100 ? 0 : 10,
                estimatedDays: 7
            },
            {
                id: 'express',
                name: 'Express Delivery',
                description: '2-3 business days',
                price: totalPrice > 200 ? 15 : 25,
                estimatedDays: 3
            },
            {
                id: 'overnight',
                name: 'Overnight Delivery',
                description: 'Next business day',
                price: 50,
                estimatedDays: 1
            }
        ];

        res.status(200).send({
            success: true,
            shippingOptions
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default checkoutRouter;