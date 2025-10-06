import { createOrder, getMyOrders, getOrderById, modifyStatus } from "../models/order.model.js"

export async function createOrderController(req, res) {
    try {
        const order = await createOrder(req.user.userId, req.body)
        res.status(201).send({ order, message: "Order created successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

export async function getMyOrdersController(req, res) {
    try {
        const myOrders = await getMyOrders(req.user.userId)
        return res.status(200).send(myOrders)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

export async function getOrderByIdController(req, res) {
    try {
        const order = await getOrderById(req.user.userId, req.params.id)
        res.status(200).send(order)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

export async function modifyStatusController(req, res) {
    try {
        const order = await modifyStatus(req.params.id, req.body.status)
        res.status(200).send({ order, message: "Order status modified successfully" })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}