import { Router } from "express";
import {
    getProductByIdController,
    getProductsController,
    getCategoriesController,
    getFeaturedProductsController,
    getRelatedProductsController,
    getSearchSuggestionsController,
    getFilterOptionsController,
    advancedSearchController
} from "../controllers/product.controller.js";

const publicProductRouter = Router();

// Public routes - no authentication required
publicProductRouter.get('/', getProductsController);
publicProductRouter.get('/search/suggestions', getSearchSuggestionsController);
publicProductRouter.get('/search/advanced', advancedSearchController);
publicProductRouter.get('/filters', getFilterOptionsController);
publicProductRouter.get('/categories', getCategoriesController);
publicProductRouter.get('/featured', getFeaturedProductsController);
publicProductRouter.get('/:id', getProductByIdController);
publicProductRouter.get('/:id/related', getRelatedProductsController);

export default publicProductRouter;