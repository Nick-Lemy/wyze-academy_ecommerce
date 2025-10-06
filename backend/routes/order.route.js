import { Router } from "express";
import { createOrderController, getMyOrdersController, getOrderByIdController, modifyStatusController } from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post('/', createOrderController)
orderRouter.get('/my', getMyOrdersController)
orderRouter.get('/:id', getOrderByIdController)
orderRouter.patch('/:id/status', modifyStatusController)


export default orderRouter