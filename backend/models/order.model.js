import { Schema, model } from "mongoose";


const orderSchema = new Schema({
    userId: {
        type: String,
        require: true
    },
    products: {
        type: [{
            productId: String,
            quantity: Number
        }],
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'received', 'shipping', 'cancelled'],
        require: true,
        default: 'pending'
    },
    shippingAddress: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Order = model('order', orderSchema)

export default Order;

export async function createOrder(userId, data) {
    const { products, shippingAddress, totalPrice } = data
    try {
        const order = await Order.create({ userId, products, shippingAddress, totalPrice })
        await order.save()
        return order
    } catch (error) {
        console.log(error)
        throw new Error("Error creating order")
    }
}

export async function getAllOrders() {
    try {
        const orders = await Order.find()
        return orders
    } catch (error) {
        console.log(error)
        throw new Error('Error fetching orders')
    }
}

export async function getMyOrders(userId) {
    try {
        const orders = await Order.find({ userId })
        return orders
    } catch (error) {
        console.log(error)
        throw new Error('Error fetching orders')
    }
}

export async function getOrderById(userId, orderId) {
    try {
        const order = await Order.findById(orderId)
        if (order.userId !== userId) {
            throw new Error("You're only allowed to look at your orders");
        }
        return order
    } catch (error) {
        console.log(error)
        throw new Error("Error fetching order by Id");
    }
}

export async function removeProductFromOrder(userId, orderId, productId) {
    try {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error("Order doesn't exist");
        }
        if (order.userId !== userId) {
            throw new Error("You're only allowed to look at your orders");
        }
        const index = order.products.findIndex(prod => prod['productId'] === productId)
        if (index === -1) {
            throw new Error("Product not found in order");
        }
        order.products.splice(index, 1)
        await order.save()
        return order
    } catch (error) {
        console.log(error)
        throw new Error("Error removing product from order");
    }
}

export async function modifyStatus(orderId, status) {
    try {
        const order = await Order.findById(orderId)
        if (!order) {
            throw new Error("Order doesn't exist");
        }
        order.status = status
        await order.save()
        return order
    } catch (error) {
        console.log(error)
        throw new Error("Error modifying order status");
    }
}