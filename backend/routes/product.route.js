import { Router } from "express";
import { addProductController, addToFavoritesController, getProductByIdController, getProductsController, modifyProductController, removeFromFavoritesController, removeProductController } from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.get('/', getProductsController);
productRouter.post('/', addProductController);
productRouter.get('/:id', getProductByIdController);
productRouter.put('/:id', modifyProductController);
productRouter.delete('/:id', removeProductController);

productRouter.post('/favorites/:id', addToFavoritesController)
productRouter.delete('/favorites/:id', removeFromFavoritesController)

export default productRouter;