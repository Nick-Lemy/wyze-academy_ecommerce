import { Schema, model } from "mongoose";


const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    products: {
        type: [{
            productId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            title: String // Store product title for historical reference
        }],
        required: true,
        validate: {
            validator: function (products) {
                return products.length > 0;
            },
            message: 'Order must contain at least one product'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
        required: true,
        default: 'pending'
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'United States' },
        phone: { type: String }
    },
    billingAddress: {
        fullName: { type: String },
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String },
        phone: { type: String },
        sameAsShipping: { type: Boolean, default: true }
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        required: true,
        default: 'credit_card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    shipping: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    discount: {
        type: Number,
        min: 0,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        maxLength: 500
    },
    trackingNumber: {
        type: String
    },
    estimatedDelivery: {
        type: Date
    }
}, {
    timestamps: true
})

const Order = model('order', orderSchema)

export default Order;

export async function createOrder(userId, data) {
    const {
        products,
        shippingAddress,
        billingAddress,
        paymentMethod = 'credit_card',
        subtotal,
        tax = 0,
        shipping = 0,
        discount = 0,
        totalPrice,
        notes
    } = data;

    try {
        // Import Product model
        const { default: Product } = await import('./product.model.js');

        // Generate unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Validate and process products
        const processedProducts = [];
        let calculatedSubtotal = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (!product.isActive) {
                throw new Error(`Product ${product.title} is not available`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}. Only ${product.stock} available`);
            }

            // Update product stock
            product.stock -= item.quantity;
            await product.save();

            const itemTotal = product.price * item.quantity;
            calculatedSubtotal += itemTotal;

            processedProducts.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                title: product.title
            });
        }

        // Validate totals
        if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
            throw new Error('Subtotal mismatch. Please refresh and try again');
        }

        const calculatedTotal = subtotal + tax + shipping - discount;
        if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
            throw new Error('Total price mismatch. Please refresh and try again');
        }

        // Create order
        const order = new Order({
            userId,
            orderNumber,
            products: processedProducts,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            subtotal: calculatedSubtotal,
            tax,
            shipping,
            discount,
            totalPrice: calculatedTotal,
            notes
        });

        await order.save();
        return order;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error creating order");
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

export async function modifyStatus(orderId, status, trackingNumber = null, estimatedDelivery = null) {
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error("Order doesn't exist");
        }

        // Validate status transition
        const validTransitions = {
            pending: ['processing', 'cancelled'],
            processing: ['paid', 'cancelled'],
            paid: ['shipped', 'cancelled'],
            shipped: ['delivered', 'cancelled'],
            delivered: ['refunded'],
            cancelled: [],
            refunded: []
        };

        if (!validTransitions[order.status].includes(status)) {
            throw new Error(`Cannot change status from ${order.status} to ${status}`);
        }

        order.status = status;

        // Update payment status based on order status
        if (status === 'paid') {
            order.paymentStatus = 'completed';
        } else if (status === 'refunded') {
            order.paymentStatus = 'refunded';
        }

        // Add tracking info if provided
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }
        if (estimatedDelivery) {
            order.estimatedDelivery = new Date(estimatedDelivery);
        }

        await order.save();
        return order;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error modifying order status");
    }
}

export async function getOrderStats(userId = null) {
    try {
        const matchStage = userId ? { userId } : {};

        const stats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' },
                    averageOrderValue: { $avg: '$totalPrice' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    }
                }
            }
        ]);

        return stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            pendingOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0
        };
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching order statistics");
    }
}

export async function getOrdersByStatus(status, page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;

        const [orders, totalCount] = await Promise.all([
            Order.find({ status })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments({ status })
        ]);

        return {
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching orders by status");
    }
}

export async function cancelOrder(orderId, userId = null, reason = null) {
    try {
        const query = { _id: orderId };
        if (userId) query.userId = userId;

        const order = await Order.findOne(query);
        if (!order) {
            throw new Error("Order not found");
        }

        if (!['pending', 'processing'].includes(order.status)) {
            throw new Error(`Cannot cancel order with status: ${order.status}`);
        }

        // Restore product stock
        const { default: Product } = await import('./product.model.js');

        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelled';
        if (reason) {
            order.notes = (order.notes ? order.notes + '\n' : '') + `Cancellation reason: ${reason}`;
        }

        await order.save();
        return order;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || "Error cancelling order");
    }
}