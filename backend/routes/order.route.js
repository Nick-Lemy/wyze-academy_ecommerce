import { Router } from "express";
import {
    createOrderController,
    getMyOrdersController,
    getOrderByIdController,
    modifyStatusController,
    cancelOrderController,
    getOrderStatsController,
    getAllOrdersController,
    getAdminOrderStatsController
} from "../controllers/order.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = Router()

// User endpoints
orderRouter.post('/', createOrderController)
orderRouter.get('/my', getMyOrdersController)
orderRouter.get('/my/stats', getOrderStatsController)
orderRouter.get('/:id', getOrderByIdController)
orderRouter.patch('/:id/cancel', cancelOrderController)

// Admin endpoints (require admin middleware) 
orderRouter.get('/admin/all', adminMiddleware, getAllOrdersController)
orderRouter.get('/admin/stats', adminMiddleware, getAdminOrderStatsController)
orderRouter.patch('/admin/:id/status', adminMiddleware, modifyStatusController)

export default orderRouter