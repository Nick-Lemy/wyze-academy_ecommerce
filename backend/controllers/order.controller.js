import {
    createOrder,
    getMyOrders,
    getOrderById,
    modifyStatus,
    getOrderStats,
    getOrdersByStatus,
    cancelOrder,
    getAllOrders
} from "../models/order.model.js"

export async function createOrderController(req, res) {
    try {
        // Validate required fields
        const { products, shippingAddress, totalPrice } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).send({ error: "Products are required" });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1) {
            return res.status(400).send({ error: "Complete shipping address is required" });
        }

        if (!totalPrice || totalPrice <= 0) {
            return res.status(400).send({ error: "Valid total price is required" });
        }

        const order = await createOrder(req.user.userId, req.body);
        res.status(201).send({
            success: true,
            order,
            message: "Order created successfully"
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        if (error.message.includes('stock') || error.message.includes('mismatch') || error.message.includes('not found')) {
            return res.status(400).send({ error: error.message });
        }
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getMyOrdersController(req, res) {
    try {
        const { page = 1, limit = 10, status } = req.query;

        let myOrders;
        if (status) {
            myOrders = await getOrdersByStatus(status, parseInt(page), parseInt(limit));
            // Filter by user
            myOrders.orders = myOrders.orders.filter(order => order.userId === req.user.userId);
        } else {
            myOrders = await getMyOrders(req.user.userId);
        }

        return res.status(200).send({
            success: true,
            orders: myOrders
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getOrderByIdController(req, res) {
    try {
        const order = await getOrderById(req.user.userId, req.params.id);
        res.status(200).send({
            success: true,
            order
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        if (error.message.includes('not allowed') || error.message.includes('not found')) {
            return res.status(404).send({ error: error.message });
        }
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function modifyStatusController(req, res) {
    try {
        const { status, trackingNumber, estimatedDelivery } = req.body;

        if (!status) {
            return res.status(400).send({ error: "Status is required" });
        }

        const order = await modifyStatus(req.params.id, status, trackingNumber, estimatedDelivery);
        res.status(200).send({
            success: true,
            order,
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        if (error.message.includes('Cannot change status')) {
            return res.status(400).send({ error: error.message });
        }
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function cancelOrderController(req, res) {
    try {
        const { reason } = req.body;
        const order = await cancelOrder(req.params.id, req.user.userId, reason);
        res.status(200).send({
            success: true,
            order,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        if (error.message.includes('Cannot cancel') || error.message.includes('not found')) {
            return res.status(400).send({ error: error.message });
        }
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getOrderStatsController(req, res) {
    try {
        const stats = await getOrderStats(req.user.userId);
        res.status(200).send({
            success: true,
            stats
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

// Admin only controllers
export async function getAllOrdersController(req, res) {
    try {
        const { page = 1, limit = 10, status } = req.query;

        let orders;
        if (status) {
            orders = await getOrdersByStatus(status, parseInt(page), parseInt(limit));
        } else {
            orders = await getAllOrders();
        }

        res.status(200).send({
            success: true,
            orders
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getAdminOrderStatsController(req, res) {
    try {
        const stats = await getOrderStats();
        res.status(200).send({
            success: true,
            stats
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(500).send({ error: "Internal Server Error" });
    }
}