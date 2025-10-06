import { Router } from "express";
import { addProductController, getProductByIdController, getProductsController, modifyProductController, removeProductController } from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.get('/', getProductsController);
productRouter.get('/:id', getProductByIdController);
productRouter.put('/:id', modifyProductController);
productRouter.post('/', addProductController);
productRouter.delete('/:id', removeProductController);
productRouter.post('/favorites',)

export default productRouter;