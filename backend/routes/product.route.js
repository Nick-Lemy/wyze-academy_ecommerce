import { Router } from "express";
import { addProductController, addToCartController, addToFavoritesController, getProductByIdController, getProductsController, modifyProductController, removeFromCartController, removeFromFavoritesController, removeProductController } from "../controllers/product.controller.js";
const productRouter = Router();

productRouter.get('/', getProductsController);
productRouter.post('/', addProductController);
productRouter.get('/:id', getProductByIdController);
productRouter.put('/:id', modifyProductController);
productRouter.delete('/:id', removeProductController);

productRouter.post('/favorites/:id', addToFavoritesController)
productRouter.delete('/favorites/:id', removeFromFavoritesController)

productRouter.post('/cart/:id', addToCartController)
productRouter.delete('/cart/:id', removeFromCartController)
export default productRouter;