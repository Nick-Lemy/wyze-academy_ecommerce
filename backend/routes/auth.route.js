import { Router } from "express";
import { loginController, registerController, getCurrentUserController } from "../controllers/auth.controller.js";
import { userMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/profile', userMiddleware, getCurrentUserController);

export default authRouter;